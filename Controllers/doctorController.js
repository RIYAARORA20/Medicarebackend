import Doctor from "../models/DoctorSchema.js"
import Booking from '../models/BookingSchema.js'
export const updateDoctor = async(req, res)=>{
    const id = req.params.id 
    try{
        const updatedDoctor = await Doctor.findByIdAndUpdate(id, {$set: req.body},{new: true})

        res.status(200).json({success: true, message: 'Successfully updated', data: updatedDoctor })
    }catch(err){
        res.status(500).json({success: false, message: 'Failed to update' })
    }
}

export const deleteDoctor = async(req, res)=>{
    const id = req.params.id 
    try{
        await Doctor.findByIdAndDelete(id);

        res.status(200).json({success: true, message: 'Successfully deleted', });
    }catch(err){
        res.status(500).json({success: false, message: 'Failed to delete' });
    }
}

export const getSingleDoctor = async(req, res)=>{
    const id = req.params.id
    try{
        const doctor = await Doctor.findById(id).populate("reviews").select("-password");;

        res.status(200).json({success: true, message: 'Doctor found', data: doctor });
    }catch(err){
        res.status(404).json({success: false, message: 'Failed to update' });
    }
};

export const getAllDoctor = async(req, res)=>{
     
    try {
        const { query } = req.query;
        let doctors;
    
        const baseQuery = {};
    
        if (query) {
            const regexQuery = {
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { specialization: { $regex: query, $options: 'i' } },
                ],
            };
    
            doctors = await Doctor.find({ ...baseQuery, ...regexQuery }).select("-password");
        } else {
            doctors = await Doctor.find(baseQuery).select("-password");
        }
    
        res.status(200).json({ success: true, message: 'Doctors found', data: doctors });
    } catch (err) {
        res.status(404).json({ success: false, message: 'Not found' });
    }
    
};

export const getDoctorProfile = async(req, res)=>{
    const doctorId = req.userId;

    try{
        const doctor = await Doctor.findById(doctorId)

        if(!doctor){
            return res.status(404).json({success: false, message: 'doctor not found' });
        }

        const {password, ...rest} = doctor._doc ;
        const appointments = await Booking.find({doctor: doctorId}).populate('user');

      

        res.status(200).json({success:true, message:'Profile info is getting', data:{...rest,appointments}})

    }catch(err){
        res.status(500).json({success: false, message: "Something went wrong, cannot get"});
    }
}