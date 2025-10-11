// Middleware de controle de acesso baseado em roles (RBAC)

/**
 * Middleware para verificar se o usuário tem permissão baseada em seu role
 * @param {string[]} allowedRoles - Array de roles permitidas para acessar a rota
 * @returns {Function} Middleware function
 */
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        try {
            // Verifica se o usuário está autenticado
            if (!req.user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Usuário não autenticado'
                });
            }

            // Verifica se o usuário foi aprovado
            if (!req.user.approved && req.user.role !== 'manager') {
                return res.status(403).json({
                    status: 'error',
                    message: 'Usuário aguardando aprovação do gerente'
                });
            }

            // Verifica se o role do usuário está na lista de roles permitidas
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Acesso negado. Você não tem permissão para esta ação.'
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao verificar permissões',
                error: error.message
            });
        }
    };
};

/**
 * Middleware para verificar se o usuário é gerente
 */
const isManager = checkRole(['manager']);

/**
 * Middleware para verificar se o usuário é gerente ou operador
 */
const isManagerOrOperator = checkRole(['manager', 'operator']);

/**
 * Middleware para verificar se o usuário tem qualquer role autenticada
 */
const isAuthenticated = checkRole(['manager', 'operator', 'client']);

/**
 * Middleware para verificar se usuário pode acessar recurso específico
 * Gerente pode acessar tudo
 * Operador pode acessar apenas seus próprios recursos
 * Cliente pode acessar apenas seus próprios recursos
 */
const checkResourceAccess = (resourceOwnerField = 'uploadedBy') => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Usuário não autenticado'
                });
            }

            // Gerente tem acesso total
            if (req.user.role === 'manager') {
                return next();
            }

            // Operador e Cliente precisam ser donos do recurso
            req.resourceOwnerField = resourceOwnerField;
            next();
        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Erro ao verificar acesso ao recurso',
                error: error.message
            });
        }
    };
};

module.exports = {
    checkRole,
    isManager,
    isManagerOrOperator,
    isAuthenticated,
    checkResourceAccess
};
