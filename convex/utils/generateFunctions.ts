import { GenericValidator, v } from "convex/values";
import { DataModel } from "../_generated/dataModel";
import { mutation, query } from "../_generated/server";

export function generateFunctions<
  TableName extends keyof DataModel,
  DocumentSchema extends Record<string, GenericValidator>,
  PartialSchema extends Record<string, GenericValidator>,
>(
  table: TableName,
  documentSchema: DocumentSchema,
  partialSchema: PartialSchema
) {
  const doc = v.object(documentSchema);
  const partialDoc = v.object(partialSchema);

  const get = query({
    args: { id: v.id(table) },
    handler: async (ctx, args) => {
      return await ctx.db.get(args.id);
    },
  });

  const insert = mutation({
    args: doc,
    handler: async (ctx, args) => {
      return await ctx.db.insert(table, args);
    },
  });

  const patch = mutation({
    args: {
      id: v.id(table),
      data: partialDoc,
    },
    handler: async (ctx, args) => {
      return await ctx.db.patch(args.id, args.data);
    },
  });

  const replace = mutation({
    args: {
      id: v.id(table),
      data: doc,
    },
    handler: async (ctx, args) => {
      return await ctx.db.replace(args.id, args.data);
    },
  });

  const del = mutation({
    args: { id: v.id(table) },
    handler: async (ctx, args) => {
      await ctx.db.delete(args.id);
      return null;
    },
  });

  return {
    get,
    insert,
    patch,
    replace,
    delete: del,
  };
}
