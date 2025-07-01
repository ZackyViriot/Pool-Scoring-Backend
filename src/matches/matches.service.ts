import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match } from './schemas/match.schema';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(Match.name) private matchModel: Model<Match>,
  ) {}

  async create(matchData: Partial<Match>): Promise<Match> {
    console.log('Creating match with data:', JSON.stringify(matchData, null, 2));
    
    // Ensure required fields are present
    if (!matchData.player1 || !matchData.player2) {
      throw new Error('Both player1 and player2 are required');
    }

    // Create the match
    const createdMatch = new this.matchModel({
      ...matchData,
      matchDate: matchData.matchDate || new Date(),
      duration: matchData.duration || 0,
      player1Score: matchData.player1Score || 0,
      player2Score: matchData.player2Score || 0,
      targetScore: matchData.targetScore || 0,
      player1Stats: {
        ...matchData.player1Stats,
        score: matchData.player1Score || 0
      },
      player2Stats: {
        ...matchData.player2Stats,
        score: matchData.player2Score || 0
      }
    });

    return createdMatch.save();
  }

  async findAll(): Promise<Match[]> {
    return this.matchModel
      .find()
      .sort({ matchDate: -1 })
      .exec();
  }

  async findAllByUser(userId: string): Promise<Match[]> {
    return this.matchModel
      .find({ userId })
      .sort({ matchDate: -1 })
      .exec();
  }

  async findByPlayer(playerId: string): Promise<Match[]> {
    return this.matchModel
      .find({
        $or: [
          { 'player1._id': playerId },
          { 'player2._id': playerId }
        ]
      })
      .sort({ matchDate: -1 })
      .exec();
  }

  async findById(id: string): Promise<Match> {
    return this.matchModel.findById(id).exec();
  }

  async delete(id: string, userId: string): Promise<void> {
    const match = await this.matchModel.findById(id);
    if (!match) {
      throw new NotFoundException('Match not found');
    }
    if (match.userId !== userId) {
      throw new UnauthorizedException('Not authorized to delete this match');
    }
    await this.matchModel.findByIdAndDelete(id);
  }
} 