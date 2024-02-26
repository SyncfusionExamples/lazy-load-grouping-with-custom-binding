import { Query } from "@syncfusion/ej2-data";
import { gridState } from '../App';

export const Grid_FetchData = "Grid_FetchData";

export const  fetchData= (state: any , query: Query) => ({
    type: "Grid_FetchData",
    payload: state,
    gridQuery: query
});

