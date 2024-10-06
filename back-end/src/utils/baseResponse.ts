class BaseResponse<T> {
    private _success = false;
    private _data: T | undefined = undefined;
    private _message: string = 'Internal Server Error'
    private _status: number = 500;

    constructor();
    constructor(_success?: boolean);
    constructor(_success?: boolean, _message?: string);
    constructor(_success?: boolean, _message?: string, _data?: T) {
        const isSuccess = _success ?? false;
        this._success = isSuccess;
        this._data = _data ?? undefined;
        this._message = _message ? _message : (isSuccess ? 'Server handle feature successfully' : 'Internal Server Error');
        this._status = isSuccess ? 200 : 500;
    }

    setData(_data:T){
        this._data = _data;
        return this;
    }
    setStatus(_status: number) {
        this._status = _status;
        return this;
    }

    setSuccess(_success: boolean) {
        this._success = _success;
        return this;
    }

    setMessage(_message: string) {
        this._message = _message;
        return this;
    }

    get status() {
        return this._status;
    }

    get body() {
        return {
            message: this._message,
            data: this._data,
            success: this._success
        }
    }
}

export default BaseResponse;
