import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class PlayerInfo {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: 0 })
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

  @Prop({ required: true, default: false })
  isBreak: boolean;

  @Prop({ required: true, default: false })
  isScratch: boolean;

  @Prop({ required: true, default: false })
  isSafetyPlay: boolean;

  @Prop({ required: true, default: false })
  isDefensiveShot: boolean;

  @Prop({ required: true, default: false })
  isFoul: boolean;

  @Prop({ required: true, default: false })
  isBreakingFoul: boolean;

  @Prop({ required: true, default: false })
  isIntentionalFoul: boolean;

  @Prop({ required: true, default: false })
  isMiss: boolean;

  @Prop({ required: true })
  points: number;

  @Prop({ required: true })
  actionText: string;

  @Prop({ required: true })
  actionColor: string;
}

@Schema()
export class Match {
  @Prop({ required: true, type: PlayerInfo })
  player1: PlayerInfo;

  @Prop({ required: true, type: PlayerInfo })
  player2: PlayerInfo;

  @Prop({ required: true, default: 0 })
  player1Score: number;

  @Prop({ required: true, default: 0 })
  player2Score: number;

  @Prop({ required: true, type: PlayerInfo })
  winner: PlayerInfo;

  @Prop({ required: true })
  gameType: string;

  @Prop({ required: true, default: 0 })
  duration: number;

  @Prop({ required: true, type: PlayerStats })
  player1Stats: PlayerStats;

  @Prop({ required: true, type: PlayerStats })
  player2Stats: PlayerStats;

  @Prop({ required: true, type: [Turn] })
  innings: Turn[];

  @Prop({ required: true })
  matchDate: Date;

  @Prop({ required: true, default: 0 })
  targetScore: number;

  @Prop({ required: true })
  userId: string;
}

export type MatchDocument = Match & Document;
export const MatchSchema = SchemaFactory.createForClass(Match); 