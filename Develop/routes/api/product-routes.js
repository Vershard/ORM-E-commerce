const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findAll({
      include: [Category],
      include: [Tag]
    })
    res.status(200).json(productData)
  } catch (err){
    res.status(500).json(err)
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data 
  // create new product
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */ 
  try {
    const productData = await Product.findOne({ 
      where: {
        id: req.params.id,
      },
      include: [Category],
      include: [Tag]
    }) 
    if(!productData){
      res.status(404).json({message: "Category not found with given id"})
    }
    res.status(200).json(productData)
  } catch (err){
    res.status(500).json(err)
  }
});


    router.post('/', async (req, res) => {
      try {
        const productData = await Product.create(req.body);
        res.status(200).json(productData);
      } catch (err) {
        res.status(400).json(err);
      }
    }); 

  Product.create (req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });


// update product
router.put('/:id', async (req, res) => {
  // update product data 
 try {
  const updatedProduct = await Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  }) 

  if(!updatedProduct){
    res.status(404).json({message: "Category not found with given id"})
    return;
  }
  res.status(200).json({message: "Category updated successfully!"})
} catch(err){
  res.status(500).json(err)
}
})
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });


router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value 
  try {
    const deletedProduct = await Product.destroy({
      where: {
        id: req.params.id
      },
    })
    if(!deletedProduct) {
      res.status(404).json({message: "Category not found with given id"})
      return;
    }
    res.status(200).json({message: "Category successfully deleted"})
  } catch (err){
    res.status(500).json(err)
  }
});

module.exports = router;
