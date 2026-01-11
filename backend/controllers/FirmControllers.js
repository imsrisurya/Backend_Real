

const Firm=require('../models/Firm');

const Vendor=require('../models/Vendor');
const multer=require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");  // Folder where files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
        // Example: 17066255349.png
    }
});
const upload=multer({storage:storage});


const addFirm=async(req,res)=>{
    try{
        const{firmName, area, category, region, offer}=req.body

    const image=req.file?req.file.filename:undefined;

    const vendor=await Vendor.findById(req.vendorId)
    if(!vendor){
        res.status(404).json({message:"vendor is not found"})
    }

    const firm=new Firm({
        firmName, area, category, region, offer,image,vendor:vendor._id
    })

    await firm.save();

    vendor.firm.push(firm)

    return res.status(200).json({message:"firm added succesfully"})
    }
    catch(error){
        console.log(error);
        res.status(500).json("internal server error")
    }
}
const deleteFirmById=async(req,res)=>{
    try{
        const firmId=req.params.firmId;
        const deletedFirm=await Firm.findByIdAndDelete(firmId)

        if(!deletedFirm)
            return res.status(400).json({error:"No Firm found"})
    }
    catch(error){
        console.log(error);
        res.status(500).json({error:"Internal Server error"})
    }
}

module.exports = {
    addFirm: [upload.single("image"), addFirm],
    deleteFirmById
};
