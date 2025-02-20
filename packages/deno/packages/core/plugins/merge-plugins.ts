// @ts-nocheck
import { GraphQLFieldResolver, GraphQLSchema, GraphQLTypeResolver } from 'https://cdn.skypack.dev/graphql?dts';
import { GiraphQLEnumValueConfig, GiraphQLInterfaceTypeConfig, GiraphQLUnionTypeConfig, } from '../types/index.ts';
import { BasePlugin } from './plugin.ts';
import { BuildCache, GiraphQLInputFieldConfig, GiraphQLOutputFieldConfig, GiraphQLTypeConfig, SchemaTypes, } from '../index.ts';
export class MergedPlugins<Types extends SchemaTypes> extends BasePlugin<Types> {
    plugins;
    constructor(buildCache: BuildCache<Types>, plugins: BasePlugin<Types>[]) {
        super(buildCache, "GiraphQLMergedPlugin" as never);
        this.plugins = plugins;
    }
    onTypeConfig(typeConfig: GiraphQLTypeConfig) {
        return this.plugins.reduceRight((config, plugin) => (config === null ? config : plugin.onTypeConfig(config)), typeConfig);
    }
    onInputFieldConfig(fieldConfig: GiraphQLInputFieldConfig<Types>) {
        return this.plugins.reduceRight<GiraphQLInputFieldConfig<Types> | null>((config, plugin) => (config === null ? config : plugin.onInputFieldConfig(config)), fieldConfig);
    }
    onOutputFieldConfig(fieldConfig: GiraphQLOutputFieldConfig<Types>) {
        return this.plugins.reduceRight<GiraphQLOutputFieldConfig<Types> | null>((config, plugin) => (config === null ? config : plugin.onOutputFieldConfig(config)), fieldConfig);
    }
    onEnumValueConfig(valueConfig: GiraphQLEnumValueConfig<Types>) {
        return this.plugins.reduceRight<GiraphQLEnumValueConfig<Types> | null>((config, plugin) => (config === null ? config : plugin.onEnumValueConfig(config)), valueConfig);
    }
    beforeBuild() {
        for (const plugin of this.plugins) {
            plugin.beforeBuild();
        }
    }
    afterBuild(schema: GraphQLSchema) {
        return this.plugins.reduceRight((nextSchema, plugin) => plugin.afterBuild(nextSchema), schema);
    }
    wrapResolve(resolve: GraphQLFieldResolver<unknown, Types["Context"], object>, fieldConfig: GiraphQLOutputFieldConfig<Types>) {
        return this.plugins.reduceRight((nextResolve, plugin) => plugin.wrapResolve(nextResolve, fieldConfig), resolve);
    }
    wrapSubscribe(subscribe: GraphQLFieldResolver<unknown, Types["Context"], object> | undefined, fieldConfig: GiraphQLOutputFieldConfig<Types>) {
        return this.plugins.reduceRight((nextSubscribe, plugin) => plugin.wrapSubscribe(nextSubscribe, fieldConfig), subscribe);
    }
    wrapResolveType(resolveType: GraphQLTypeResolver<unknown, Types["Context"]>, typeConfig: GiraphQLInterfaceTypeConfig | GiraphQLUnionTypeConfig) {
        return this.plugins.reduceRight((nextResolveType, plugin) => plugin.wrapResolveType(nextResolveType, typeConfig), resolveType);
    }
}
