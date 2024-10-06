import WebsiteSchema, {WebsiteSchemaKey} from "../models/website-schema.model";

export interface ISchemaWebsiteCheerio {
    value: string;
    position?: number;
    type?: string
}

class NormalSchema {
    private _schema: { [key: string]: ISchemaWebsiteCheerio } = {}

    constructor(params: WebsiteSchema[]) {
        if (params.length) {
            params.forEach(x => {
                if (Object.hasOwnProperty.call(WebsiteSchemaKey, `${x.key}`)) {
                    this._schema[WebsiteSchemaKey[`${x.key}`]] = {
                        value: x.value,
                        position: x?.position || undefined,
                        type: x?.type || undefined
                    }
                }

            })
        }
    }

    get schema(): { [key: string]: ISchemaWebsiteCheerio } {
        return this._schema;
    }
}

export default NormalSchema
