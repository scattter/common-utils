import 'reflect-metadata'
// 全局容器
const providerMap = new WeakMap()
// 装饰器, 声明的时候就注册实例到全局容器
function provider(target: any) {
    providerMap.set(target, null)
}
// 构造实例的辅助函数, 通过该函数可以通过递归的方式依次构建实例(无论构造参数是否是类)
function create(target: any) {
    // 获取目标类的构造参数
    const paramsType = Reflect.getOwnMetadata('design:paramtypes', target) || []

    // 递归查找构造参数, 查找后返回并创建一个实例
    const deps = paramsType.map((type: any) => {
        const instance = providerMap.get(type)
        if (instance === null) {
            providerMap.set(type, create(type))
        }
        return providerMap.get(type)
    })
    console.log(deps, target, '---')

    return new target(...deps)
}

@provider
class FlowerService {
    public age: number | undefined
    constructor(age: number) {
        this.age = age
    }
    name() {
        console.log('this is flower')
    }
}

@provider
class Hello {
    public flower: FlowerService | undefined
    public detail: string | undefined
    constructor(flower: FlowerService, detail: string) {
        this.flower = flower
    }
}

const hello = create(Hello)
hello.flower.name()
console.log(hello.detail)