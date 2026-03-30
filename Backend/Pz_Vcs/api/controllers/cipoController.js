const db = require("../db");
const  {cipoService }  = require("../service")(db);

exports.getCipok = async (req, res, next) => {
    try {
        const filter = req.cipoFilter || {};

        res.status(200).json(
            await cipoService.getCipok(filter, {
                transaction: req.transaction,
            })
        );
    } catch (error) {
        next(error);
    }
};
exports.addCipoKep = async (req, res, next) => {
    try {
  
      const cipoId = req.params.id;
      const { urls } = req.body;
  
      const result = await cipoService.addCipoKepek(cipoId, urls, {
        transaction: req.transaction
      });
  
      res.status(201).json(result);
  
    } catch (error) {
      next(error);
    }
  };
  exports.addCipoMeretek = async (req,res,next)=>{
    try{
   
     const cipoId = req.params.id
     const { meretek } = req.body
   
     const result = await cipoService.addCipoMeretek(cipoId,meretek,{
      transaction:req.transaction
     })
   
     res.status(201).json(result)
   
    }catch(error){
     next(error)
    }
   }

exports.getCipo = async (req, res, next) => {
    try {
        res.status(200).json(
            await cipoService.getCipo(req.params.id, {
                transaction: req.transaction,
            })
        );
    } catch (error) {
        next(error);
    }
};

exports.createCipo = async (req, res, next) => {
    try {
        const result = await cipoService.createCipo(req.body, {
            transaction: req.transaction,
        });

        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

exports.updateCipo = async (req, res, next) => {
    try {
        await cipoService.updateCipo(req.params.id, req.body, {
            transaction: req.transaction,
        });

        res.status(200).json({ message: "Cipő frissítve" });
    } catch (error) {
        next(error);
    }
};

exports.deleteCipo = async (req, res, next) => {
    try {
        await cipoService.deleteCipo(req.params.id, {
            transaction: req.transaction,
        });

        res.status(200).json({ message: "Cipő törölve" });
    } catch (error) {
        next(error);
    }
};