import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const TicketScalarFieldEnumSchema = z.enum(['id','title','url','status','totalTime','createdAt','updatedAt']);

export const TaskScalarFieldEnumSchema = z.enum(['id','isSurveyTask','ticketId','status','type','title','parentId','createdAt','updatedAt']);

export const PlanScalarFieldEnumSchema = z.enum(['id','taskId','predictionRequiredTimeOfFirst','predictionRequiredTimeOfFinal','predictionSurveyTimeOfFirst','predictionSurveyTimeOfFinal','surveyDetail','createdAt','updatedAt']);

export const AchievementScalarFieldEnumSchema = z.enum(['id','isDone','taskId','doneDate','surveyTime','operatingTime','createdAt','updatedAt']);

export const CheckScalarFieldEnumSchema = z.enum(['id','taskId','analysis','createdAt','updatedAt']);

export const FeedbackScalarFieldEnumSchema = z.enum(['id','taskId','issues','improvements','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// TICKET SCHEMA
/////////////////////////////////////////

export const TicketSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  url: z.string().nullable(),
  status: z.number().int(),
  totalTime: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Ticket = z.infer<typeof TicketSchema>

/////////////////////////////////////////
// TASK SCHEMA
/////////////////////////////////////////

export const TaskSchema = z.object({
  id: z.number().int(),
  isSurveyTask: z.boolean(),
  ticketId: z.number().int().nullable(),
  status: z.number().int(),
  type: z.number().int(),
  title: z.string().nullable(),
  parentId: z.number().int().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Task = z.infer<typeof TaskSchema>

/////////////////////////////////////////
// PLAN SCHEMA
/////////////////////////////////////////

export const PlanSchema = z.object({
  id: z.number().int(),
  taskId: z.number().int(),
  predictionRequiredTimeOfFirst: z.coerce.date().nullable(),
  predictionRequiredTimeOfFinal: z.coerce.date().nullable(),
  predictionSurveyTimeOfFirst: z.coerce.date().nullable(),
  predictionSurveyTimeOfFinal: z.coerce.date().nullable(),
  surveyDetail: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Plan = z.infer<typeof PlanSchema>

/////////////////////////////////////////
// ACHIEVEMENT SCHEMA
/////////////////////////////////////////

export const AchievementSchema = z.object({
  id: z.number().int(),
  isDone: z.boolean(),
  taskId: z.number().int(),
  doneDate: z.coerce.date().nullable(),
  surveyTime: z.number().int().nullable(),
  operatingTime: z.number().int().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Achievement = z.infer<typeof AchievementSchema>

/////////////////////////////////////////
// CHECK SCHEMA
/////////////////////////////////////////

export const CheckSchema = z.object({
  id: z.number().int(),
  taskId: z.number().int(),
  analysis: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Check = z.infer<typeof CheckSchema>

/////////////////////////////////////////
// FEEDBACK SCHEMA
/////////////////////////////////////////

export const FeedbackSchema = z.object({
  id: z.number().int(),
  taskId: z.number().int(),
  issues: z.string().nullable(),
  improvements: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Feedback = z.infer<typeof FeedbackSchema>
