import 'reflect-metadata'
// 为字段设置默认值
// @Default(false)
function RefDefault(value: unknown) {
    return function (target: Object, propertyKey: string | symbol) {
        Reflect.set(target, propertyKey, value);
    };
}

// 为字段强制指定类型
// @Type(Boolean)
function RefType(type: any) {
}

// 为字段标记一个别名, 将别名的值赋值给propertyKey
// @Alias('admin')
function RefAlias(name: string) {
    return function (target: any, propertyKey: string) {
        Object.defineProperty(target, name, {
            set(value) {
                Reflect.set(target, propertyKey, value)
            }
        })
    }
}

class CusReflect {
    constructor() {
    }

    @RefDefault('main name')
    public name!: string;

    @RefDefault('sub name')
    public subName!: string;

    @RefAlias('bar')
    public foo!: boolean;
}

new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve({
            bar: false,
            name: 'not empty'
        })
    }, 1000)
}).then((res: any) => {
    let cusReflect = new CusReflect();
    Object.assign(cusReflect, res);
    console.log('赋值后', cusReflect.foo, cusReflect) // false hello not empty
})