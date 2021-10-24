const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try{
   const categoryData = await Category.findAll({
      include: [Product]
    });
    res.status(200).json(categoryData)
  } catch (err){
    res.status(500).json(err)
  }
  // find all categories
  // be sure to include its associated Products
});

router.get('/:id', async (req, res) => {
 try{
   const categoryData = await Category.findOne({
     where: {
       id: req.params.id,
     },
     include: [Product],
   })
   if(!categoryData){
     res.status(404).json({message: "Category not found with given id"})
   }
   res.status(200).json(categoryData)
 } catch(err){
   res.status(500).json(err)
 }
  // find one category by its `id` value
  // be sure to include its associated Products
});

router.post('/', async (req, res) => {
  try{
    const categoryData = await Category.create(req.body)
    res.status(200).json(categoryData)
  } catch (err) {
    res.status(400).json(err)
  }
  // create a new category
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try{
    const updatedCategory = await Category.update(
     req.body,
     {
       where: {
         id: req.params.id
       }
     }
    )
    if(!updatedCategory){
      res.status(404).json({message: "Category not found with given id"})
      return;
    }
    res.status(200).json({message: "Category updated successfully!"})
  } catch(err){
    res.status(500).json(err)
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const deletedCategory = await Category.destroy({
      where: {
        id: req.params.id
      },
    })
    if(!deletedCategory) {
      res.status(404).json({message: "Category not found with given id"})
      return;
    }
    res.status(200).json({message: "Category successfully deleted"})
  } catch (err){
    res.status(500).json(err)
  }
});

module.exports = router;
