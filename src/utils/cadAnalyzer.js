const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class CADAnalyzer {
    constructor() {
        this.supportedFormats = ['stp', 'step', 'x_t'];
    }

    /**
     * Analyze a CAD file and extract basic properties
     * @param {string} filePath - Path to the CAD file
     * @param {string} format - File format (stp, step, x_t)
     * @returns {Object} Analysis results
     */
    async analyzeFile(filePath, format) {
        try {
            const fileStats = await fs.stat(filePath);
            
            // Basic file analysis
            const basicAnalysis = {
                fileSize: fileStats.size,
                lastModified: fileStats.mtime,
                format: format.toLowerCase()
            };

            // Try to extract CAD-specific information
            let cadAnalysis = {};
            
            if (format.toLowerCase() === 'stp' || format.toLowerCase() === 'step') {
                cadAnalysis = await this.analyzeSTEPFile(filePath);
            } else if (format.toLowerCase() === 'x_t') {
                cadAnalysis = await this.analyzeParasolidFile(filePath);
            }

            return {
                ...basicAnalysis,
                ...cadAnalysis,
                processed: true,
                analyzedAt: new Date()
            };
        } catch (error) {
            console.error('Error analyzing CAD file:', error);
            return this.getDefaultAnalysis(format);
        }
    }

    /**
     * Analyze STEP/STP file format
     * @param {string} filePath 
     * @returns {Object}
     */
    async analyzeSTEPFile(filePath) {
        try {
            // Read first part of file to extract basic information
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const lines = fileContent.split('\n').slice(0, 100); // First 100 lines
            
            // Extract basic STEP file information
            const analysis = {
                volume: this.estimateVolumeFromFileSize(filePath),
                surfaceArea: 0,
                complexity: 'medium',
                estimatedMachiningTime: 0,
                suggestedMaterials: [],
                manufacturingProcesses: []
            };

            // Look for specific STEP entities that indicate complexity
            const entityCounts = {
                faces: 0,
                edges: 0,
                vertices: 0,
                curves: 0
            };

            lines.forEach(line => {
                if (line.includes('FACE') || line.includes('ADVANCED_FACE')) entityCounts.faces++;
                if (line.includes('EDGE') || line.includes('ORIENTED_EDGE')) entityCounts.edges++;
                if (line.includes('VERTEX')) entityCounts.vertices++;
                if (line.includes('CURVE') || line.includes('B_SPLINE_CURVE')) entityCounts.curves++;
            });

            // Estimate complexity based on entity counts
            const totalEntities = entityCounts.faces + entityCounts.edges + entityCounts.curves;
            if (totalEntities < 50) {
                analysis.complexity = 'low';
            } else if (totalEntities > 200) {
                analysis.complexity = 'high';
            }

            // Estimate machining time based on complexity and volume
            analysis.estimatedMachiningTime = this.calculateMachiningTime(
                analysis.volume, 
                analysis.complexity
            );

            // Suggest materials and processes based on complexity
            analysis.suggestedMaterials = this.suggestMaterials(analysis.complexity);
            analysis.manufacturingProcesses = this.suggestProcesses(analysis.complexity);

            return analysis;
        } catch (error) {
            console.error('Error analyzing STEP file:', error);
            return this.getDefaultAnalysis('stp');
        }
    }

    /**
     * Analyze Parasolid X_T file format
     * @param {string} filePath 
     * @returns {Object}
     */
    async analyzeParasolidFile(filePath) {
        try {
            // For X_T files, we'll do basic file-size-based estimation
            const stats = await fs.stat(filePath);
            
            const analysis = {
                volume: this.estimateVolumeFromFileSize(filePath, stats.size),
                surfaceArea: 0,
                complexity: stats.size > 1000000 ? 'high' : stats.size > 100000 ? 'medium' : 'low',
                estimatedMachiningTime: 0,
                suggestedMaterials: [],
                manufacturingProcesses: []
            };

            analysis.estimatedMachiningTime = this.calculateMachiningTime(
                analysis.volume, 
                analysis.complexity
            );

            analysis.suggestedMaterials = this.suggestMaterials(analysis.complexity);
            analysis.manufacturingProcesses = this.suggestProcesses(analysis.complexity);

            return analysis;
        } catch (error) {
            console.error('Error analyzing X_T file:', error);
            return this.getDefaultAnalysis('x_t');
        }
    }

    /**
     * Estimate volume based on file size (rough approximation)
     * @param {string} filePath 
     * @param {number} fileSize 
     * @returns {number} Estimated volume in cubic centimeters
     */
    estimateVolumeFromFileSize(filePath, fileSize = null) {
        try {
            if (!fileSize) {
                const stats = require('fs').statSync(filePath);
                fileSize = stats.size;
            }

            // Rough estimation: larger files often contain more complex/larger parts
            // This is a simplified approach - real CAD analysis would require specialized libraries
            
            if (fileSize < 50000) return 10; // Small parts: ~10 cm³
            if (fileSize < 200000) return 50; // Medium parts: ~50 cm³
            if (fileSize < 500000) return 150; // Large parts: ~150 cm³
            if (fileSize < 1000000) return 300; // Very large parts: ~300 cm³
            return 500; // Extra large parts: ~500 cm³
        } catch (error) {
            return 50; // Default fallback
        }
    }

    /**
     * Calculate estimated machining time
     * @param {number} volume - Volume in cm³
     * @param {string} complexity - low, medium, high
     * @returns {number} Estimated time in hours
     */
    calculateMachiningTime(volume, complexity) {
        const baseTimePerCm3 = {
            'low': 0.1,      // 6 minutes per cm³
            'medium': 0.2,   // 12 minutes per cm³
            'high': 0.4      // 24 minutes per cm³
        };

        const timePerCm3 = baseTimePerCm3[complexity] || baseTimePerCm3['medium'];
        const setupTime = complexity === 'high' ? 2 : complexity === 'medium' ? 1 : 0.5;
        
        return Math.round((volume * timePerCm3 + setupTime) * 10) / 10;
    }

    /**
     * Suggest materials based on complexity
     * @param {string} complexity 
     * @returns {Array<string>}
     */
    suggestMaterials(complexity) {
        const materialsByComplexity = {
            'low': ['Alumínio 6061', 'Aço 1020', 'Plástico ABS'],
            'medium': ['Alumínio 7075', 'Aço 4140', 'Latão', 'Aço Inox 304'],
            'high': ['Titânio', 'Aço ferramenta', 'Inconel', 'Aço Inox 316']
        };

        return materialsByComplexity[complexity] || materialsByComplexity['medium'];
    }

    /**
     * Suggest manufacturing processes based on complexity
     * @param {string} complexity 
     * @returns {Array<string>}
     */
    suggestProcesses(complexity) {
        const processesByComplexity = {
            'low': ['Fresamento CNC', 'Torneamento', 'Furação'],
            'medium': ['Fresamento 3-eixos', 'Torneamento CNC', 'EDM', 'Retificação'],
            'high': ['Fresamento 5-eixos', 'EDM de precisão', 'Torneamento multi-eixos', 'Usinagem de alta velocidade']
        };

        return processesByComplexity[complexity] || processesByComplexity['medium'];
    }

    /**
     * Get default analysis when file processing fails
     * @param {string} format 
     * @returns {Object}
     */
    getDefaultAnalysis(format) {
        return {
            volume: 50,
            surfaceArea: 0,
            complexity: 'medium',
            estimatedMachiningTime: 2.5,
            suggestedMaterials: ['Alumínio 6061', 'Aço 1020'],
            manufacturingProcesses: ['Fresamento CNC', 'Torneamento'],
            processed: false,
            note: 'Análise automática não disponível - valores estimados'
        };
    }

    /**
     * Validate if file format is supported
     * @param {string} format 
     * @returns {boolean}
     */
    isFormatSupported(format) {
        return this.supportedFormats.includes(format.toLowerCase());
    }
}

module.exports = CADAnalyzer;