import { path }         from "../../base/backend/ts/dep.ts";

//TODO: code re-use with upstream

export function root():string {
    return path.fromFileUrl(
        import.meta.resolve('../../')
    )
}

export function static_():string {
    return path.join(root(), 'static/')
}

export function frontend():string {
    return path.join(root(), 'frontend/')
}
