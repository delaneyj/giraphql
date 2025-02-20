/* eslint-disable max-classes-per-file */
import { OutputRef, outputShapeKey } from '../types';
import BaseTypeRef from './base';

import { InterfaceParam, ObjectTypeOptions, SchemaTypes } from '..';

export default class ObjectRef<T> extends BaseTypeRef implements OutputRef {
  kind = 'Object' as const;

  [outputShapeKey]: T;

  constructor(name: string) {
    super('Object', name);
  }
}

export class ImplementableObjectRef<Types extends SchemaTypes, Shape> extends ObjectRef<Shape> {
  private builder: GiraphQLSchemaTypes.SchemaBuilder<Types>;

  constructor(builder: GiraphQLSchemaTypes.SchemaBuilder<Types>, name: string) {
    super(name);

    this.builder = builder;
  }

  implement<Interfaces extends InterfaceParam<Types>[]>(
    options: ObjectTypeOptions<Types, ObjectRef<Types>, Shape, Interfaces>,
  ) {
    return this.builder.objectType(this, options);
  }
}
