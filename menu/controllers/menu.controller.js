const MenuModel = require('../models/menu.model')

exports.index = (req, res) => {
    MenuModel.findByRestId(req.params.id).then((result) => {
        if (result.length === 0) return res.status(404).send({
            success: false,
            err: 'Restaurant doesn\'t have menus yet'
        })
        return res.status(200).send({success: true, res: result['items']})
    })
}

exports.getItemData = (req, res) => {
    // console.log(req.data)
    return res.status(200).send({data: req.data})
}