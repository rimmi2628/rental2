const models = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Property = models.Property;
const Image = models.Image;
const Amenity = models.Amenity;
const Property_Amenity = models.Property_Amenity;
const Property_Image = models.Property_Image;
const Property_Room = models.Property_Room;
const Property_Room_Image = models.Property_Room_Image;
const Question = models.Question;
const Question_Option = models.Question_Options;
const Property_Question = models.Property_Question;
const Property_Question_Option = models.Property_Question_Option;
const User = models.User;
const { Op } = require('sequelize');
const property_applicant =models.Property_Applicant
const Question_submission=models.Property_Question_Submission
const Property_Tenant=models.Property_Tenant
const Question_Submission_Option=models.Question_Submission_Option
const {Sequelize}=require('sequelize');

require('dotenv').config();





// user property.....
exports.postproperty = async (req, res, next) => {
    try {
      
        const userid = req.userid;
        const user = await Property.create({
            user_id: userid,
            name: req.body.name,
            description: req.body.description,
            property_type: req.body.property_type,
            tenancy_status: req.body.tenancy_status,
            address: req.body.address,
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            postal_code: req.body.postal_code,
            country: req.body.country,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            area: req.body.area,
            furnishing_status: req.body.furnishing_status,
            share_property_url: req.body.share_property_url


        });
       

        const images = req.body.image;
        const property_image = [];
        for (im of images) {
            property_image.push({
                property_id: user.id,
                image_id: im.images
            })

        }
        const pro = await Property_Image.bulkCreate(property_image);


        const amenities = req.body.amenity;
        const property_amenities = [];
        for (am of amenities) {
            console.log("my ame is" + am.id);
            property_amenities.push({
                property_id: user.id,
                amenity_id: am.id
            })

        }
        const amen = await Property_Amenity.bulkCreate(property_amenities);

        const room = req.body.rooms;
        const proroom = [];
        for (ro of room) {
            const getimage = await Image.findOne({ where: { id: ro.images } });
            proroom.push({
                property_id: user.id,
                image_id: ro.images,
                name: ro.name,
                url: getimage.file_name,
                caption: getimage.caption,
                room_type: ro.room_type,
                condition: ro.condition
            });

        }
        const getroom = await Property_Room.bulkCreate(proroom);

        const pro_room_image = [];
        for (ima of getroom) {

            pro_room_image.push({
                room_id: ima.id,
                image_id: ima.image_id,
                image_url: ima.url
            });
        }
        const getroomimage = await Property_Room_Image.bulkCreate(pro_room_image);

        const question = req.body.question;

        for (que of question) {
            const proques = await Question.findOne({ where: { id: que.question_id } })
            const getques = {
                property_id: user.id,
                question_id: que.question_id,
                option_id: que.option_id,
                title: proques.title,
                type: proques.type,
                has_other: proques.has_other
            }
            const getproques = await Property_Question.create(getques);

            const option = await Question_Option.findAll({ where: { question_id: que.question_id } });
            for (opt of option) {
                const getopt = {

                    property_id: user.id,
                    property_question_id: getproques.id,
                    option_id: opt.id,
                    text: opt.text,
                    preferred: opt.id == getproques.option_id ? 1 : 0
                }
                const getproopt = await Property_Question_Option.create(getopt);
            }

        }


        const getdetail = await Property.findAll({

            where: { id: user.id },

            include: [
                {
                    model: Image,
                    as: 'property_image',
                    attributes: ['id', 'file_name', 'caption', 'user_id',],
                    through:{
                        attributes:[]
                    }

                },
                {
                    model: Amenity,

                    attributes: ['id', 'name', 'icon'],
                    through:{
                        attributes:[]
                    }
                },
                {
                    model: Property_Room,

                    attributes: ['id', 'name', 'url', 'room_type', 'caption'],
                    
                }


            ],


        }

        )




        res.status(200).json({ data: getdetail });

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error });
    }


}




exports.postimage = async (req, res, next) => {
    try {
        const userid = req.userid;
        const image = [];
        for (im of req.files) {
            image.push({
                file_name: im.filename,
                user_id: userid,
                caption: req.body.caption,

            })
        }
        const user = await Image.bulkCreate(image);
        res.status(201).json({ sucess: 'ok', data: user });
    } catch (error) {
        res.status(400).json({ error });
    }


}



exports.postdelete = async (req, res, next) => {
    try {
        const userid = req.userid;

        const user = await Image.destroy({
            where: {
                [Op.and]: [
                    { id: req.body.id },
                    { user_id: userid }
                ]
            }
        });
        res.status(200).json({ message: "delete suceesfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }

}






exports.postamenity = async (req, res, next) => {
    try {

        //   console.log(req.files.filename);
        const user = await Amenity.bulkCreate(req.body
        );

        res.status(200).json({ data: user });

    } catch (error) {
        console.log(error);
        res.status(400).json({ error });

    }
}






exports.getamenity = async (req, res, next) => {
    try {

        const user = await Amenity.findAll();
        res.status(200).json({ data: user });
    } catch (error) {
        res.status(500).json({ message: error });
    }

}

exports.postquestion = async (req, res, next) => {
    try {
        const userid = req.userid;
        const user = await Question.create({
            user_id: userid,
            title: req.body.title,
            type: req.body.type,
            hasother: req.body.hasother


        });
        const option = req.body.options;
        console.log(option);
        const question = [];
        for (que of option) {
            question.push({
                question_id: user.id,
                text: que.text,
                preferred: que.preferred
            });
        }
        const quesn = await Question_Option.bulkCreate(question);

        res.status(200).json({ data: user, quesn });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });

    }
}

exports.getquestion = async (req, res, next) => {

    try {

        const user = await Question.findAll({
            include: [Question_Option]
        });
        res.status(200).json({ data: user });



    } catch (error) {
        res.status(500).json({ message: error });
    }
}





exports.updateproperty = async (req, res, next) => {
    try {
        const userid = req.userid;
        const user = await Property.update({
            name: req.body.name,
            description: req.body.description,
            property_type: req.body.property_type,
            tenancy_status: req.body.tenancy_status,
            address: req.body.address,
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            postal_code: req.body.postal_code,
            country: req.body.country,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            area: req.body.area,
            furnishing_status: req.body.furnishing_status,
            share_property_url: req.body.share_property_url



        },
            {
                where: {
                    id: req.body.property_id
                }
            }

        );

        const images = req.body.image;
        await Property_Image.destroy({ where: { property_id: req.body.property_id } });

        for (im of images) {
            const pro = await Property_Image.create(

                {
                    image_id: im.images,
                    property_id: req.body.property_id
                },

            );

        }


 
        const amenities = req.body.amenity;
        await Property_Amenity.destroy({ where: { property_id: req.body.property_id } });

        for (am of amenities) {
            const amen = await Property_Amenity.create({
                amenity_id: am.id,
                property_id: req.body.property_id
            }
            );


        }

        const room = req.body.rooms;
        for (ro of room) {
            const getimage = await Image.findOne({ where: { id: ro.images } });
            const getroom = await Property_Room.update({
                image_id: ro.images,
                name: ro.name,
                url: getimage.file_name,
                caption: getimage.caption,
                room_type: ro.room_type,
                condition: ro.condition
            },
                {
                    where: {
                        property_id: req.body.property_id
                    }
                });

            for (ima of getroom) {

                await Property_Room_Image.update({

                    image_id: ima.image_id,
                    image_url: ima.url
                },
                    {
                        where: {
                            room_id: ima.id
                        }
                    });
            }

        }


        const question = req.body.question;
        for (que of question) {
            const proques = await Question.findOne({ where: { id: que.question_id } })
            const getques = await Property_Question.update({
                question_id: que.question_id,
                option_id: que.option_id,
                title: proques.title,
                type: proques.type,
                has_other: proques.has_other
            },
                {
                    where: {
                        property_id: req.body.property_id
                    }
                })


            const option = await Question_Option.findAll({ where: { question_id: que.question_id } });
            for (opt of option) {
                const getopt = await Property_Question_Option.update({


                    property_question_id: getques.id,
                    option_id: opt.id,
                    text: opt.text,
                    preferred: opt.id == getques.option_id ? 1 : 0
                },
                    {
                        where: {
                            property_id: req.body.property_id
                        }
                    })

            }

        }






        res.status(200).json({ data: "updated sucressfully" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error });
    }


}


exports.delpro = async (req, res, next) => {
    try {


        // const property_id=req.body.property_id;
        //     console.log("property id"+property_id);
        const detail = await Property.findOne({ where: { id: req.body.property_id } });
        if (!detail) {
            res.status(500).json({ msg: "property doesnot exist" });
            return;
        }
        const del = await Property.destroy({ where: { id: req.body.property_id } });

        res.status(200).json({ data: "delete sucessfullyy...." });
        // console.log("hello");
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error });
    }
}




exports.filteruser = async (req, res) => {
    try {
        const arr=[];
        const search=[];
        const {type,keyword}=req.body
        if(req.body.type){
            arr.push({
                isblocked:type
            })
            
        }
        
       if(req.body.keyword){

        search.push({
         [Op.or
        ]:[
            {firstname: {[Op.like]:`%${keyword}%`}},
            {email: {[Op.like]:`%${keyword}%`}}
        ]
        })
       }
      const detail= {[Op.and]:[...arr,...search]
    }     

        console.log("welcome")
        const user = await User.findAll({

         where:
            detail
         



        });
        const data = [];
        for (us of user) {
            const { count, rows } = await Property.findAndCountAll({

                
                where: {
                    user_id: us.id,
                 
                },
                
            })
            data.push(
                {
                     userid:us.id,
                    count: count,
                   
                }
            )
        }

        res.send(data);


    } catch (error) {
        console.log(error);
    }


}





exports.proapplicant=async(req,res)=>{
     try {
        const userid=req.userid;
        console.log("jhjuhbu",userid);
        // property_applicant.....



      const   {firstname,lastname,phone,email,move_in_date,remarks,image_id,property_id}=req.body;
      const user=await property_applicant.create({
        firstname:firstname,
        lastname:lastname,
        phone:phone,
        email:email,
        move_in_date:move_in_date,
        remarks:remarks,
        image_id:image_id,
        property_id:property_id,
      });
  

//property question_submission.....


      const questionid=req.body.property_question_id;
      console.log("hgdc7uygtrf",questionid);
    //   const userid=req.userid;
    //   console.log("jhjuhbu",userid);
      const quesuser=await Question.findOne({where:{id:questionid},attributes:["id","user_id","title","type",'has_other']});
      console.log("bfsdhbn",quesuser)
      const quessub=await  Question_submission.create({
             property_applicant_id:user.id,
             property_question_id:questionid,
             title:quesuser.title,
             type:quesuser.type,
             has_other:quesuser.has_other,
                    
   
      });

      const finoption=await Question_Option.findOne({where:{question_id:questionid}});
    //   console.log("options are " ,finoption);
     const ques_sub_opt=await Question_Submission_Option.create({
                question_id:quessub.property_question_id,
                option_id:finoption.id,
                text:finoption.text,
                preferred:finoption.preferred,
                
     });  
     console.log("oiptiyg9oh", ques_sub_opt);

            


    




      const option=await Question_Option.findAll({where:{question_id:questionid},attributes:["text","question_id","preferred"]}
        
        )


//property_tenant.......

      const {lease_from,lease_to,status,file_name,}=req.body;

      const imageid=await Image.findOne({where:{id:image_id}});
      const protenant=await Property_Tenant.create({
             property_id:user.property_id,
             user_id:userid,
             lease_from:lease_from,
             lease_to:lease_to,
             status:status,
             image_id:user.image_id,
             file_name:imageid.file_name,
             email:user.email

      })
       

     res.status(200).json({data:quesuser,option});



     } catch (error) {
        console.log(error);
        res.status(500).json(error);
     }


}
   


// get information of question submission option
//  exports.getquestionsubmit=async (req,res)=>{
// try {
//     // const getapplicant=await property_applicant.findOne({where:{property_id:req.body.property_id}, attributes:["firstname","lastname"]  });
    
//     // console.log(getapplicant);

//     const getquessub=await Property_Tenant.findAll({where:{ id:req.body.tenant_id
//        },    attributes: ["id" ,"lease_from","lease_to"]
//     });
//     res.status(200).json({data:getapplicant,getquessub});
// } catch (error) {
//     console.log(error);
// }
//  }


  exports.prolocation=async(req,res)=>{
    try {
        
    
    const {latitude,longitude,distance}=req.body;
    const haversine = `(
        6371 * acos(
            cos(radians(${latitude}))
            * cos(radians(latitude))
            * cos(radians(longitude) - radians(${longitude}))
            + sin(radians(${latitude})) * sin(radians(latitude))
        )
    )`;

    // const propertys=await Property.findAll({
    //     attributes: [
    //         'id','name',
    //         [Sequelize.literal(haversine), 'distance'],
    //     ],
    //     order: Sequelize.col('distance'),
    //    having: Sequelize.literal(`distance <= ${distance}`),
    //   limit: 5
    // });
    // res.status(200).json({data:propertys});
   
       }   catch (error) {
        console.log(error);
       } 

}





