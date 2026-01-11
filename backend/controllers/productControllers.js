
const Product=require('../models/Product');
const Firm=require('../models/Firm');

const multer=require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    
    }
});
const upload=multer({storage:storage});

const addProduct=async(req,res)=>{
    try{
        const{productName,price,category,bestSeller,description}=req.body
        const image=req.file?req.file.filename:undefined;

        const firmId=req.params.firmId;
        const firm=await Firm.findById(firmId)

        if(!firm){
            return res.status(404).json({error:"no firm found"})
        }

        const product=new Product({
            productName,
            price,
            category,
            bestSeller,
            description,
            image,
            firm:firm._id
        })
        const savedProduct = await product.save();

        firm.products.push(savedProduct._id); 
        await firm.save();
        
        return res.status(200).json({savedProduct})
    }
    catch(error){
        console.log(error);
        res.status(500).json("internal server error")
    }
}

const getProductByFirm=async(req,res)=>{
    try{
        const firmId=req.params.firmId;
        const firm=await Firm.findById(firmId);

        if(!firm){
            return res.status(404).json({error:"No firm found"});
        }

        const restaurentName=firm.firmName;
        const products=await Product.find({firm:firmId});
        res.status(200).json({restaurentName,products});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:"Internal Server error"})
    }
}

const deleteProductById=async(req,res)=>{
    try{
        const productId=req.params.productIdId;
        const deletedProduct=await Product.findByIdAndDelete(productId)

        if(!deletedProduct)
            return res.status(400).json({error:"No Product found"})
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:"Internal Server error"})
    }
}

module.exports={
    addProduct:[upload.single("image"),addProduct],
    getProductByFirm,
    deleteProductById
};