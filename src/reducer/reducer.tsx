import { Grid_FetchData } from './action';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { createLazyLoadData, lazyLoadData } from '../datasource';
import { DataStateChangeEventArgs, LazyLoadGroup } from '@syncfusion/ej2-react-grids';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

interface sortInfo{
    name?:string;
    field?:string;
    direction:string
}
interface filterInfo{
    fn?:string;
    e?:string;
    field: string;
    matchCase: boolean;
    operator: string;
    predicate: string;
    value: string;
    
}

interface payloadInfo {
    isLazyLoad: boolean;
    onDemandGroupInfo?: { [key: string]: number };
    action: {
        lazyLoadQuery: LazyLoadGroup;
    };
}

const initialGrouping = { columns: ['ProductName', 'OrderID'], enableLazyLoading: true };
const initialFiltering = {columns: [{field: 'CustomerName', matchCase: false, operator: 'startswith', predicate: 'and', value: 'Maria'}]}
const initialSorting = {columns: [{ field: 'ProductID', direction: 'Descending' }]}
const initialPaging ={allowPaging: true};
const initialState: any = {
    data: lazyLoadData,
    error: false,
    result: [],
    count: 0,
}

const applyFiltering = (query:Query, filter:filterInfo[]) => {
    for (let i = 0; i < filter.length; i++) {
        const { fn, e } = filter[i];
        if (fn === 'onWhere') {
            query.where(e as string);
        }
    }
}

const applySorting = (query:Query, sorted:sortInfo[]) => {
    for (let i = 0; i < sorted.length; i++) {
        const { name, direction } = sorted[i];
        query.sortBy((name as string), direction);
    }
}

const applyGrouping = (query:Query, group:Object[]) => {
    for (let i = 0; i < group.length; i++) {
        query.group(group[i] as string);
    }
}

const applyLazyLoad = (query:Query, payload:payloadInfo) => {
    if (payload.isLazyLoad) {
        query.lazyLoad.push({ key: 'isLazyLoad', value: true });
        if (payload.onDemandGroupInfo) {
            query.lazyLoad.push({
                key: 'onDemandGroupInfo',
                value: payload.action.lazyLoadQuery,
            });
        }
    }
}

const applyPage = (query:Query, page:DataStateChangeEventArgs) => {
    if (page.take && page.skip) {
        const pageSkip = page.skip / page.take + 1;
        const pageTake = page.take;
        query.page(pageSkip, pageTake);
    } else if (page.skip === 0 && page.take) {
        query.page(1, page.take);
    }
}

const reducer = (state = initialState, action: any) => {
    createLazyLoadData();
    const dataSource = [...initialState.data];
    const query = new Query();
    switch (action.type) {
        case Grid_FetchData: {
            if (action.payload.where) {
                applyFiltering(query, action.gridQuery.queries);
            }
            if (!isNullOrUndefined(action.payload.sorted)) {
                applySorting(query, action.payload.sorted);
            }
            if (!isNullOrUndefined(action.payload.group)) {
                applyGrouping(query, action.payload.group);
            }
            applyLazyLoad(query, action.payload);
            applyPage(query, action.payload);
            if (action.payload.requiresCounts) {
                query.isCountRequired = true;
            }
            const currentResult:any = new DataManager(dataSource).executeLocal(query);
            return ({
                data: { result: currentResult.result, count: currentResult.count }
            })
        }

        default: {
            if (initialFiltering.columns.length) {
                applyFiltering(query, initialFiltering.columns);
            }
            if (initialSorting.columns.length) {
                applySorting(query, initialSorting.columns);
            }
            if (initialGrouping.columns.length) {
                applyGrouping(query, initialGrouping.columns);
            }
            if (initialGrouping.enableLazyLoading) {
                query.lazyLoad.push({ key: 'isLazyLoad', value: true })
            }
            if (initialPaging.allowPaging) {
                const pageSkip = 1;
                const pageTake = 12;
                query.page(pageSkip, pageTake);
            }
            query.isCountRequired= true;
            const currentResult:any = new DataManager(dataSource).executeLocal(query);
            return ({
                data: { result: currentResult.result , count: currentResult.count}
            })
        }
    }
}
export default reducer;
