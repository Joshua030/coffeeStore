import { findRecordByFilter, getMinifiedRecords, table } from "lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;
  try {
    if (id) {
        const records = await findRecordByFilter(id);
    //   const findCoffeeStoreRecords = await table
    //     .select({
    //       filterByFormula: `id="${id}"`,
    //     })
    //     .firstPage();
      // res.send('hi there')
      // console.log({ findCoffeeStoreRecords });
      // const records = findCoffeeStoreRecords.map(({ fields }) => {
      //   return { ...fields };
      // });
      if (records.length !== 0) {
        // const records = getMinifiedRecords(findCoffeeStoreRecords);
        res.json(records);
      } else {
        res.json({message:`id is created could not be found`})
      }
      // res.json({message:`id is created ${id}`})
    } else {
      res.status(400);
      res.json({ message: `id is missing}` });
    }
  } catch (error) {
    res.status(500);
    res.json({ message: "something went wrong", error });
  }
};

export default getCoffeeStoreById;
