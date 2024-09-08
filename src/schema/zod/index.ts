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

export const HistoryScalarFieldEnumSchema = z.enum(['id','isActive','achivementId','surveyTime','operatingTime','createdAt','updatedAt']);

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

// TICKET RELATION SCHEMA
//------------------------------------------------------

export type TicketRelations = {
  tasks: TaskWithRelations[];
};

export type TicketWithRelations = z.infer<typeof TicketSchema> & TicketRelations

export const TicketWithRelationsSchema: z.ZodType<TicketWithRelations> = TicketSchema.merge(z.object({
  tasks: z.lazy(() => TaskWithRelationsSchema).array(),
}))

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

// TASK RELATION SCHEMA
//------------------------------------------------------

export type TaskRelations = {
  ticket?: TicketWithRelations | null;
  plans: PlanWithRelations[];
  parent?: TaskWithRelations | null;
  children: TaskWithRelations[];
  achievements: AchievementWithRelations[];
  checks: CheckWithRelations[];
  feedbacks: FeedbackWithRelations[];
};

export type TaskWithRelations = z.infer<typeof TaskSchema> & TaskRelations

export const TaskWithRelationsSchema: z.ZodType<TaskWithRelations> = TaskSchema.merge(z.object({
  ticket: z.lazy(() => TicketWithRelationsSchema).nullable(),
  plans: z.lazy(() => PlanWithRelationsSchema).array(),
  parent: z.lazy(() => TaskWithRelationsSchema).nullable(),
  children: z.lazy(() => TaskWithRelationsSchema).array(),
  achievements: z.lazy(() => AchievementWithRelationsSchema).array(),
  checks: z.lazy(() => CheckWithRelationsSchema).array(),
  feedbacks: z.lazy(() => FeedbackWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// PLAN SCHEMA
/////////////////////////////////////////

export const PlanSchema = z.object({
  id: z.number().int(),
  taskId: z.number().int(),
  predictionRequiredTimeOfFirst: z.number().int().nullable(),
  predictionRequiredTimeOfFinal: z.number().int().nullable(),
  predictionSurveyTimeOfFirst: z.number().int().nullable(),
  predictionSurveyTimeOfFinal: z.number().int().nullable(),
  surveyDetail: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Plan = z.infer<typeof PlanSchema>

// PLAN RELATION SCHEMA
//------------------------------------------------------

export type PlanRelations = {
  task: TaskWithRelations;
};

export type PlanWithRelations = z.infer<typeof PlanSchema> & PlanRelations

export const PlanWithRelationsSchema: z.ZodType<PlanWithRelations> = PlanSchema.merge(z.object({
  task: z.lazy(() => TaskWithRelationsSchema),
}))

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

// ACHIEVEMENT RELATION SCHEMA
//------------------------------------------------------

export type AchievementRelations = {
  task: TaskWithRelations;
  histories: HistoryWithRelations[];
};

export type AchievementWithRelations = z.infer<typeof AchievementSchema> & AchievementRelations

export const AchievementWithRelationsSchema: z.ZodType<AchievementWithRelations> = AchievementSchema.merge(z.object({
  task: z.lazy(() => TaskWithRelationsSchema),
  histories: z.lazy(() => HistoryWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// HISTORY SCHEMA
/////////////////////////////////////////

export const HistorySchema = z.object({
  id: z.number().int(),
  isActive: z.boolean(),
  achivementId: z.number().int(),
  surveyTime: z.number().int().nullable(),
  operatingTime: z.number().int().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type History = z.infer<typeof HistorySchema>

// HISTORY RELATION SCHEMA
//------------------------------------------------------

export type HistoryRelations = {
  achievement?: AchievementWithRelations | null;
};

export type HistoryWithRelations = z.infer<typeof HistorySchema> & HistoryRelations

export const HistoryWithRelationsSchema: z.ZodType<HistoryWithRelations> = HistorySchema.merge(z.object({
  achievement: z.lazy(() => AchievementWithRelationsSchema).nullable(),
}))

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

// CHECK RELATION SCHEMA
//------------------------------------------------------

export type CheckRelations = {
  task: TaskWithRelations;
};

export type CheckWithRelations = z.infer<typeof CheckSchema> & CheckRelations

export const CheckWithRelationsSchema: z.ZodType<CheckWithRelations> = CheckSchema.merge(z.object({
  task: z.lazy(() => TaskWithRelationsSchema),
}))

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

// FEEDBACK RELATION SCHEMA
//------------------------------------------------------

export type FeedbackRelations = {
  task: TaskWithRelations;
};

export type FeedbackWithRelations = z.infer<typeof FeedbackSchema> & FeedbackRelations

export const FeedbackWithRelationsSchema: z.ZodType<FeedbackWithRelations> = FeedbackSchema.merge(z.object({
  task: z.lazy(() => TaskWithRelationsSchema),
}))
