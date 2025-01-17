import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class PlayerInfo {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 0 })
  handicap: number;
}

@Schema()
export class PlayerStats {
  @Prop({ required: true, default: 0 })
  score: number;

  @Prop({ required: true, default: 0 })
  totalPoints: number;

  @Prop({ required: true, default: 0 })
  totalInnings: number;

  @Prop({ required: true, default: 0 })
  safes: number;

  @Prop({ required: true, default: 0 })
  misses: number;

  @Prop({ required: true, default: 0 })
  bestRun: number;

  @Prop({ required: true, default: 0 })
  scratches: number;

  @Prop({ required: true, default: 0 })
  fouls: number;

  @Prop({ required: true, default: 0 })
  intentionalFouls: number;

  @Prop({ required: true, default: 0 })
  breakingFouls: number;

  @Prop({ required: true, default: 0 })
  currentRun: number;

  @Prop({ type: [Number], default: [] })
  runHistory: number[];
}

@Schema()
export class Turn {
  @Prop({ required: true })
  playerNumber: number;

  @Prop({ required: true })
  playerName: string;

  @Prop({ required: true, default: 0 })
  ballsPocketed: number;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true, default: 0 })
  score: number;

  @Prop({ required: true, default: 1 })
  inning: number;

  @Prop({ default: false })
  isBreak: boolean;
}

@Schema({ timestamps: true })
export class Match extends Document {
  @Prop({ type: PlayerInfo, required: true })
  player1: PlayerInfo;

  @Prop({ type: PlayerInfo, required: true })
  player2: PlayerInfo;

  @Prop({ required: true, default: 0 })
  player1Score: number;

  @Prop({ required: true, default: 0 })
  player2Score: number;

  @Prop({ type: PlayerInfo })
  winner: PlayerInfo;

  @Prop({ required: true, default: 0 })
  duration: number;

  @Prop({ type: PlayerStats, required: true })
  player1Stats: PlayerStats;

  @Prop({ type: PlayerStats, required: true })
  player2Stats: PlayerStats;

  @Prop({ type: [Turn], default: [] })
  innings: Turn[];

  @Prop({ required: true, default: Date.now })
  matchDate: Date;

  @Prop({ required: true, default: 0 })
  targetScore: number;
}

export const MatchSchema = SchemaFactory.createForClass(Match); 