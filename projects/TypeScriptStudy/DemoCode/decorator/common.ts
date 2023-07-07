// 为字段设置默认值
// @Default(false)
function ComDefault(value: unknown) {
    return function (target: Object, propertyKey: string | symbol) {
        Object.defineProperty(target, propertyKey, {
            configurable: true,
            enumerable: true,
            writable: true,
            value: value
        });
    };
}

// 为字段强制指定类型
// @Type(Boolean)
function ComType(type: any) {
    return function(target: any, propertyKey: string) {
        let value = target[propertyKey];

        // getter 和 setter 方法
        const getter = function() {
            return value;
        };

        const setter = function(newValue: any) {
            // 检查值的类型是否与指定类型匹配
            if (typeof newValue === type) {
                value = newValue;
            } else {
                throw new Error(`Invalid type. Expected ${type}`);
            }
        };

        // 替换字段定义为具有指定类型的属性
        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    };
}

// 为字段标记一个别名, 将别名的值赋值给propertyKey
// @Alias('admin')
function ComAlias(name: string) {
    // 当将新的数据赋值给实例的时候, 将别名的值赋值给propertyKey 进而实现别名
    return function (target: any, propertyKey: string) {
        Object.defineProperty(target, name, {
            set(value) {
                target[propertyKey] = value
            }
        });
    }
}

class Foo {
    constructor() {
    }

    @ComDefault(true)
    public bar!: boolean;

    @ComDefault('hello')
    public name!: string;

    @ComAlias('detail')
    public desc!: string;

    public say() {
        console.log('hello world');
    }
}

new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve({
            bar: false,
            detail: 'not empty'
        })
    }, 1000)
}).then((res: any) => {
    let foo = new Foo();
    Object.assign(foo, res);
    console.log('赋值后', foo.bar, foo.name, foo.desc) // false hello not empty
})