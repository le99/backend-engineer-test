
var express = require('express');
var router = express.Router();
const db = require('../db/postgresql');
const _ = require('underscore');
const { checkAuth, hasPermissions } = require('./checkAuthMiddleware');
const { PAGE_SIZE } = require('../constants');
const yup = require('yup');
const validator = require('validator');

router.use(checkAuth, hasPermissions('admin'));


router.get('/user', async function(req, res) {
    let page = (req.query.page) ? parseInt(req.query.page, 10) : 0;
    let query = (req.query.query) ? "%" + req.query.query + "%" : "%";

    let stores = (await db.query(
        `SELECT id, email 
      FROM auth_user 
      WHERE email ILIKE $1
      LIMIT $2 
      OFFSET $3`,
        [query, PAGE_SIZE + 1, page * PAGE_SIZE])).rows;

    let d = {};
    if (stores.length === PAGE_SIZE + 1) {
        d.nextPage = page + 1;
        stores.pop();
    }
    d.data = stores;
    if (page != 0) {
        d.prevPage = page - 1;
    }

    return res.json(d);
});

router.get('/user/:id', async function(req, res) {
    const userId = req.params.id;

    let stores = (await db.query(
        `SELECT id, email 
      FROM auth_user 
      WHERE id = $1`,
        [userId])).rows;

    if (stores.length == 0) {
        return res.status(404).json({});
    }

    let permissions = (await db.query(`
    SELECT auth_permission.permission
    FROM auth_user_permission JOIN auth_permission ON auth_user_permission.permission = auth_permission.id
    WHERE auth_user_permission.auth_user = $1
    `, [userId])).rows;

    return res.json({ ...stores[0], permissions: _.map(permissions, p => p.permission) });
});

const permissionSchema = yup.object({
    name: yup.string().required()
});

router.post('/user/:userId/permission', async function(req, res) {
    try { await permissionSchema.validate(req.body); }
    catch (err) { return res.status(500).json(err.errors); }

    const perm = req.body.name;
    if (perm !== 'seller') {
        return res.status(500).json({});
    }

    const userId = req.params.userId;
    let users = (await db.query(
        `SELECT id 
        FROM auth_user 
        WHERE id = $1`,
        [userId])).rows;

    if (users.length === 0) {
        return res.status(404).json({});
    }

    await db.query(
        `INSERT INTO auth_user_permission (auth_user, permission) (
    SELECT $1, auth_permission.id FROM auth_permission WHERE auth_permission.permission = 'seller' LIMIT 1
    );`
        , [userId]
    )

    return res.json({});
});


router.delete('/user/:userId/permission/:id', async function(req, res) {
    const perm = req.params.id;
    if (perm !== 'seller') {
        return res.status(500).json({});
    }

    const userId = req.params.userId;
    let users = (await db.query(
        `SELECT id 
        FROM auth_user 
        WHERE id = $1`,
        [userId])).rows;

    if (users.length === 0) {
        return res.status(404).json({});
    }

    await db.query(
        `
        WITH perm_q AS (
            SELECT id
            FROM auth_permission
            WHERE permission = 'seller'
        )
        DELETE FROM auth_user_permission
        USING perm_q AS pq
        WHERE auth_user_permission.auth_user = $1 AND auth_user_permission.permission = pq.id`
        , [userId]
    )

    return res.json({});
});


module.exports = router;
