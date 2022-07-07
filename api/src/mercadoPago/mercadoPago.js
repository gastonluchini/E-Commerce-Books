require("dotenv").config();
const { Router } = require("express");
const router = Router();
const { ACCESS_TOKEN } = process.env;

// SDK de Mercado Pago
const mercadopago = require("mercadopago");
const Books = require("../model/Books");
const Orders = require("../model/Order");
const Users = require("../model/Users");
const { Enum, EnumStatus } = require("./EmunStatus");
const { randomId } = require("./FuntionID");

mercadopago.configure({
  access_token: `${ACCESS_TOKEN}`,
});

router.post("/orden", async (req, res) => {
  const carrito = req.body;
  const email = carrito.map((e) => e.email);

  const ID = randomId(100);
  const ID2 = randomId(100);
  const idOrder = `a${ID}b${ID2}`;

  const monto = carrito
    .map((e) => {
      const montoTem = e.unit_price * carrito.length;
      return montoTem;
    })
    .reduce((a, b) => a + b);

  const user = await Users.findOne({ email: email[0] });
  const book = await carrito.map(async (e) =>{
    const temBooks = await Books.findOne({title: e.title})
    return temBooks
  } );
  const bookDb = await Promise.all(book);
  

  const newOrder = new Orders({
    status: Enum.CREATED,
    fecha: new Date(),
    usuario: user._id,
    produt: carrito.map((e) => e.title),
    total: monto,
    payment_id: idOrder,
    payment_status: EnumStatus.PENDING,
    payment_order_id: idOrder,
  });

  await newOrder.save();
  user.buyBooks = user.buyBooks.concat(bookDb.map(e=> e._id));
  await user.save();
 

  try {
    const itemsMp = carrito?.map((e) => ({
      title: e.title,
      unit_price: Number(e.unit_price),
      quantity: Number(e.quantity),
    }));

    let preference = {
      items: itemsMp,
      external_reference: `${idOrder}`,
      payment_methods: {
        excluded_payment_type: [
          {
            id: "atm",
          },
        ],
        installments: 4,
      },

      back_urls: {
        success: "https://localhost/3001/mecadopago/success",
        failure: "https://localhost/3001/mecadopago/success",
        pending: "https://localhost/3001/mecadopago/success",
      },
      auto_return: "approved",
    };
    const saveOrder = await Orders.findById({ _id: newOrder._id }).populate({
      path: "usuario",
    });

    const respuesta = await mercadopago.preferences.create(preference);

    const globalInitPoint = respuesta.body.init_point;
    return res.json({ init_point: globalInitPoint, order: saveOrder });
  } catch (error) {
    return console.log("FALLO MERCADO PAGO", error);
  }
});

router.post("/success", async (req, res) => {
  const { external_reference } = req.query;
  console.log(req.query);
  try {
    const order = await Orders.findOneAndUpdate({
      payment_order_id: external_reference,
    });
    console.log("antes", order.payment_status);
    order.payment_status = EnumStatus.SUCCESS;
    order.save();
    console.log(order.payment_status, "despues");
    return res.json(order);
  } catch (error) {
    console.log("FALLO SUCCESS ", error);
  }
});

//http://localhost:8080/feedback?collection_id=1290273508&collection_status=approved&payment_id=1290273508&status=approved&external_reference=a59b17&payment_type=credit_card&merchant_order_id=5143913058&preference_id=1152954796-49f441b2-e9d1-494f-8bdc-571a606e2a63&site_id=MCO&processing_mode=aggregator&merchant_account_id=null

// {"id":1152954796,"nickname":"TETE5687095","password":"qatest2807","site_status":"active","site_id":"MCO","description":"a description","date_created":"2022-07-01T17:25:00-04:00","date_last_updated":"2022-07-01T17:25:00-04:00"} VENDEDOR

// {"id":1152955480,"nickname":"TETE6325107","password":"qatest9152","site_status":"active","site_id":"MCO","description":"a description","date_created":"2022-07-01T17:26:17-04:00","date_last_updated":"2022-07-01T17:26:17-04:00"}

// curl -X POST \
// -H "Content-Type: application/json" \
// -H 'Authorization: Bearer ${TEST_ACCESS_TOKEN}' \
// "https://api.mercadopago.com/users/test" \
// -d '{"site_id":"MCO","description" : "a description"}'

module.exports = router;
