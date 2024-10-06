class Pagination {
    private _total: number = 0;
    private _itemPerpage: number = 0;
    private _currentPage: number = 0;

    constructor(_total: number = 0, _itemPerpage = 0, _currentPage = 0) {
        this._total = _total
        this._itemPerpage = _itemPerpage
        this._currentPage = _currentPage
    }

    get paging() {
        return {
            currentPage: this._currentPage,
            itemPerPage: this._itemPerpage,
            page: this._total === 0 ? 0 : Math.ceil(this._total / this._itemPerpage)
        }
    }
}

export default Pagination
