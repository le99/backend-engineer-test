const db = require('../db/postgresql');
const _ = require('underscore');
const checkAuth = (req, res, next) => {
    if (!req.session.userInfo) {
        req.isAuthenticated = false;
    } else {
        req.isAuthenticated = true;
    }
    next();
};

const hasPermissions = (...permissions) => {
    return async (req, res, next) => {
        if (!req.isAuthenticated) {
            return res.status(403).json({ msg: 'missing permissions' });
        }
        if (permissions.length == 0) {
            return next();
        }
        const id = req.session.userInfo.sub;
        const q = await db.query(
            'SELECT auth_permission.permission ' +
            'FROM auth_user_permission JOIN auth_permission ' +
            'ON auth_user_permission.permission =  auth_permission.id ' +
            'WHERE auth_user_permission.auth_user = $1 AND ' +
            'auth_permission.permission = ANY ($2)', [id, permissions]);

        let perm = _.map(q.rows, q => q.permission);
        for (let i = 0; i < permissions.length; i++) {
            if (!_.contains(perm, permissions[i])) {
                return res.status(403).json({ msg: 'missing permissions' });
            }
        }
        next();
    }
};

module.exports = { checkAuth, hasPermissions };
