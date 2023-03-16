// import CoffeeStore from "../coffee-store/[id]";

import { findRecordByFilter, getMinifiedRecords, table } from "lib/airtable";

// const Airtable = require("airtable");
// const base = new Airtable({ apiKey: process.env.AIRTABLE_API_TOKEN }).base(
//   process.env.AIRTABLE_BASE_KEY
// );
// const table = base("coffee-stores");
// console.log({ table });

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    //find a record
    const { id, name, locality, address, imgUrl, voting } = req.body;
    console.log('newVote',voting);
    const newVote=parseInt(voting)
    console.log('create',req.body);
  
    try {
        if (id) {
          const records = await findRecordByFilter(id)
      // const findCoffeeStoreRecords = await table
      //   .select({
      //     filterByFormula: `id="${id}"`,
      //   })
      //   .firstPage();
      // res.send('hi there')
      // console.log({ findCoffeeStoreRecords });
      // const records = findCoffeeStoreRecords.map(({ fields }) => {
      //   return { ...fields };
      // });
      if (records.length !== 0) {
        // const records = getMinifiedRecords(findCoffeeStoreRecords);
        res.json(records);
      } else {
        if (name) {
        //create a record
        const createRecords = await table.create([
          {
            fields: {
              id,
              name,
              address,
              locality,
              voting:1,
              imgUrl,
            },
          },
        ]);
        // const records = createRecords.map(({ fields }) => {
        //     return { ...fields };
        //   });
        const records = getMinifiedRecords(createRecords);
        res.json(records);
      }else {
        res.status(400);
        res.json({ message: "name is missing" });
      }
    }
    } else {
        res.status(400);
        res.json({ message: "Id is missing" });
      }
    } catch (err) {
      console.error("Error creating or finding a store", err);
      res.status(500);
      res.json({ message: "Error creating or finding a store", err });
    }
  }
};
//----

export default createCoffeeStore;
