import React, { useEffect} from 'react';
import './App.css';
import { useDispatch, useSelector } from "react-redux";
import { ColumnDirective, ColumnsDirective, Filter, GridComponent, DataStateChangeEventArgs, LazyLoadGroup,Inject, Page, Sort, GroupSettingsModel, Group, SortSettingsModel, FilterSettingsModel } from '@syncfusion/ej2-react-grids'
import { fetchData } from './reducer/action';

export interface gridState{
  data:{
    result:Object[];
    count:number;
  }
}
const App = () => {    
  var gridInstance: GridComponent|null;
  const groupSettings: GroupSettingsModel={enableLazyLoading: true, columns:['ProductName']};
  const filterSettings:FilterSettingsModel = {columns: [{field: 'CustomerName', matchCase: false, operator: 'startswith', predicate: 'and', value: 'Maria'}]}
const sortSettings:SortSettingsModel = {columns: [{ field: 'ProductID', direction: 'Descending' }]}
  const state = useSelector((state: gridState) => state);
  const dispatch = useDispatch();

  const dataStateChange = (args: DataStateChangeEventArgs) => {
    const query = (gridInstance as GridComponent).getDataModule().generateQuery();
    dispatch(fetchData(args, query));
  }

  useEffect(() => {
    if (gridInstance) {
      gridInstance.dataSource = state.data;
    }
  },[state.data])
  
  return (
      <GridComponent ref={grid => gridInstance = grid} allowSorting={true} allowFiltering={true} 
      allowPaging={true} 
      allowGrouping={true}
      filterSettings={filterSettings}
      groupSettings={groupSettings}
      sortSettings={sortSettings}
      dataStateChange={dataStateChange}
      >
        <ColumnsDirective>
        <ColumnDirective field='OrderID' headerText='Order ID' textAlign="Right" width='120' isPrimaryKey={true} />
        <ColumnDirective field='ProductName' headerText='Product Name' width='160' />
        <ColumnDirective field='ProductID' headerText='Product ID' textAlign="Right" width='120' />
        <ColumnDirective field='CustomerName' headerText='Customer Name' width='160' />
      </ColumnsDirective>
      <Inject services={[Page, Sort, Filter, Group, LazyLoadGroup]} />
      </GridComponent>
  )
}

export default (App);