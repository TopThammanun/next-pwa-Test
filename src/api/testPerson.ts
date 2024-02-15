import baseAPI from "@/api/base";
import { apiBaseType } from "@/api/base/apiBaseType";
import { Person, PersonDb } from "@/types/person";

const testPersonAPI = {
  getAllData() {
    return baseAPI.get({
      url: `/pwaTest/all`,
    });
  },
  createData(req: { data: Person }) {
    return baseAPI.post({
      url: `/pwaTest/create`,
      data: req.data,
    });
  },
};

export default testPersonAPI;
