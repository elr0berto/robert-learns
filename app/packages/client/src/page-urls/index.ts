abstract class IParam {
    optional: boolean;

    protected constructor(optional: boolean) {
        this.optional = optional;
    }

    formatParamForUrl(name: string) : string {
        return "/:" + name + (this.optional? "?" : "");
    }
}

class OptionalStringNumberParam extends IParam {
    isOptionalStringNumber: boolean;
    constructor() {
        super(true);
        this.isOptionalStringNumber = true;
    }
}

class StringNumberParam extends IParam {
    isStringNumber: boolean;
    constructor() {
        super(true);
        this.isStringNumber = true;
    }
}

class OptionalStringParam extends IParam {
    isOptionalString: boolean;
    constructor() {
        super(true);
        this.isOptionalString = true;
    }
}

class StringParam extends IParam {
    isString: boolean;
    constructor() {
        super(false);
        this.isString = true;
    }
}

class OptionalNumberParam extends IParam {
    isOptionalNumber: boolean;
    constructor() {
        super(true);
        this.isOptionalNumber = true;
    }
}

class NumberParam extends IParam {
    isNumber: boolean;
    constructor() {
        super(false);
        this.isNumber = true;
    }
}

interface IParams {
    [key: string]: OptionalStringNumberParam | StringNumberParam | OptionalNumberParam | OptionalStringParam | NumberParam | StringParam;
}

class IPageUrl<TP extends IParams> {
    route: string;
    params?: TP

    constructor(route: string, params?: TP){
        this.route = route;
        if (this.route.length > 1 && this.route.slice(-1) === "/") {
            this.route = this.route.slice(0, -1);
        }

        this.params = params;
    }

    getRoute() {
        let route: string = this.route;

        if (this.params) {
            const params = this.params;
            Object.keys(params).forEach(key => {
                const param = params[key];
                route += param.formatParamForUrl(key);
            });
        }
        return route;
    }

    pageUrl(values?: {[K in keyof TP]:
        TP[K] extends OptionalStringNumberParam ? string | number | null : (
            TP[K] extends StringNumberParam ? string | number : (
                TP[K] extends OptionalStringParam ? string | null : (
                    TP[K] extends OptionalNumberParam ? number | null : (
                        TP[K] extends StringParam ? string : number
                    )
                )
            )
        )
    }) : string {
        let pageUrl = '/mina-sidor' + this.getRoute();

        if (this.params) {
            const params = this.params;
            Object.keys(params).forEach(key => {
                const value = values ? values[key] : null;
                const param = params[key];

                if (value === null && !param.optional) {
                    throw new Error('Missing param "' + key + '" in ' + pageUrl);
                }
                pageUrl = pageUrl.replace(param.formatParamForUrl(key), value === null ? '' : '/' + value);
            });
        }
        return pageUrl;
    }
}

const pageUrls = {
    front: new IPageUrl('/'),
    bookings: new IPageUrl('/hantera-bokningar', {child_id: new OptionalNumberParam()}),
    children: new IPageUrl('/mina-barn'),
    settings: new IPageUrl('/inställningar'),
    myClinics: new IPageUrl('/min-klinik', {child_id: new OptionalNumberParam()}),
    referral: new IPageUrl('/bjud-in-en-kompis'),
    inbox: new IPageUrl('/inbox', {child_id: new OptionalNumberParam()}),
    personalOffers: new IPageUrl('/personliga-erbjudanden'),
    journal: new IPageUrl('/tidigare-besök', {child_id: new OptionalNumberParam()}),
    atb: new IPageUrl('/mitt-tandvårdsbidrag'),
    health: new IPageUrl('/hälsodeklaration'),
};

export { pageUrls }