var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:name', function(req, res, next) {
  //res.send(req.params.name + "'s order");
  res.render('receive', {
    shop: req.params.name,
    orders: [
      {
        id: 79,
        dish: [
          {id: 0, name: "白飯", number: 2},
          {id: 3, name: "小菜", number: 3}
        ],
        price: 100
      },
      {
        id: 682,
        dish: [
          {id: 0, name: "拉麵", number: 2},
          {id: 3, name: "小菜", number: 3}
        ],
        price: 150
      }
    ]
  });
});

module.exports = router;
