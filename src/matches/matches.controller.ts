import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MatchesService } from './matches.service';
import { Match, PlayerInfo, PlayerStats, Turn } from './schemas/match.schema';

@Controller('matches')
@UseGuards(JwtAuthGuard)
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  async create(@Body() matchData: Partial<Match>) {
    try {
      console.log('Received match data:', JSON.stringify(matchData, null, 2));

      // Process player stats
      const processStats = (stats: any): PlayerStats => {
        if (!stats) {
          return {
            score: 0,
            totalPoints: 0,
            totalInnings: 0,
            safes: 0,
            misses: 0,
            bestRun: 0,
            scratches: 0,
            fouls: 0,
            intentionalFouls: 0,
            breakingFouls: 0,
            currentRun: 0,
            runHistory: []
          };
        }

        const processedStats = {
          score: Number(stats.score) || 0,
          totalPoints: Number(stats.totalPoints) || 0,
          totalInnings: Number(stats.totalInnings) || 0,
          safes: Number(stats.safes) || 0,
          misses: Number(stats.misses) || 0,
          bestRun: Number(stats.bestRun) || 0,
          scratches: Number(stats.scratches) || 0,
          fouls: Number(stats.fouls) || 0,
          intentionalFouls: Number(stats.intentionalFouls) || 0,
          breakingFouls: Number(stats.breakingFouls) || 0,
          currentRun: Number(stats.currentRun) || 0,
          runHistory: Array.isArray(stats.runHistory) ? stats.runHistory.map(run => Number(run) || 0) : []
        };

        // Calculate best run from run history if available
        if (processedStats.runHistory.length > 0) {
          processedStats.bestRun = Math.max(
            processedStats.bestRun,
            Math.max(...processedStats.runHistory)
          );
        }

        return processedStats;
      };

      // Process innings data
      const processInnings = (innings: any[]): Turn[] => {
        if (!Array.isArray(innings)) {
          console.error('Innings is not an array:', innings);
          return [];
        }

        return innings.filter(turn => turn != null).map((turn, index) => {
          try {
            return {
              playerNumber: Number(turn.playerNumber) || 1,
              playerName: String(turn.playerName || `Player ${turn.playerNumber || 1}`),
              ballsPocketed: Number(turn.ballsPocketed) || 0,
              action: String(turn.action || 'unknown'),
              timestamp: new Date(turn.timestamp || Date.now()),
              score: Number(turn.score) || 0,
              inning: Number(turn.inning) || index + 1,
              points: Number(turn.points) || 0,
              isBreak: Boolean(turn.isBreak) || false,
              isScratch: Boolean(turn.isScratch) || false,
              isSafetyPlay: Boolean(turn.isSafetyPlay) || false,
              isDefensiveShot: Boolean(turn.isDefensiveShot) || false,
              isFoul: Boolean(turn.isFoul) || false,
              isBreakingFoul: Boolean(turn.isBreakingFoul) || false,
              isIntentionalFoul: Boolean(turn.isIntentionalFoul) || false,
              isMiss: Boolean(turn.isMiss) || false,
              actionText: String(turn.actionText || turn.action || 'unknown'),
              actionColor: String(turn.actionColor || '#000000')
            };
          } catch (error) {
            console.error('Error processing turn:', turn, error);
            throw error;
          }
        });
      };

      // Process player info
      const processPlayerInfo = (player: any): PlayerInfo => {
        if (!player) {
          console.error('Player info is missing');
          throw new Error('Player info is required');
        }

        return {
          name: String(player.name || 'Unknown Player'),
          handicap: Number(player.handicap) || 0
        };
      };

      // Process the match data
      const processedMatch = {
        userId: matchData.userId,
        gameType: matchData.gameType || '8-ball',
        player1: processPlayerInfo(matchData.player1),
        player2: processPlayerInfo(matchData.player2),
        player1Stats: processStats(matchData.player1Stats),
        player2Stats: processStats(matchData.player2Stats),
        innings: processInnings(matchData.innings),
        matchDate: new Date(matchData.matchDate || Date.now()),
        targetScore: Number(matchData.targetScore) || 0,
        duration: Number(matchData.duration) || 0,
        player1Score: Number(matchData.player1Score) || 0,
        player2Score: Number(matchData.player2Score) || 0,
        winner: matchData.winner ? processPlayerInfo(matchData.winner) : null
      };

      console.log('Processed match data:', JSON.stringify(processedMatch, null, 2));
      return await this.matchesService.create(processedMatch);
    } catch (error) {
      console.error('Error creating match:', error);
      if (error.name === 'ValidationError') {
        console.error('Validation error details:', error.errors);
      }
      throw error;
    }
  }

  @Get()
  findAll() {
    return this.matchesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchesService.findById(id);
  }

  @Get('player/:playerId')
  findByPlayer(@Param('playerId') playerId: string) {
    return this.matchesService.findByPlayer(playerId);
  }
} 