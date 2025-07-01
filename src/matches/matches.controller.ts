import { Controller, Get, Post, Body, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MatchesService } from './matches.service';
import { Match, PlayerInfo, PlayerStats, Turn } from './schemas/match.schema';
import { Request } from 'express';

@Controller('matches')
@UseGuards(JwtAuthGuard)
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  async create(@Body() matchData: Partial<Match>, @Req() request: Request) {
    try {
      // Log request details
      console.log('=== Request Details ===');
      console.log('Headers:', JSON.stringify(request.headers, null, 2));
      console.log('Method:', request.method);
      console.log('URL:', request.url);
      console.log('User:', request.user);
      console.log('=== End Request Details ===\n');

      // Log raw body before any processing
      console.log('=== Raw Request Body ===');
      console.log(JSON.stringify(request.body, null, 2));
      console.log('=== End Raw Request Body ===\n');

      // Validate required fields
      console.log('Validating required fields...');
      if (!matchData) {
        throw new Error('No match data provided');
      }

      // Get user id from JWT token
      const userId = (request.user as any)?.userId;
      if (!userId) {
        throw new Error('User ID not found in token');
      }
      matchData.userId = userId;

      if (!matchData.player1 || !matchData.player2) {
        throw new Error('Both player1 and player2 are required');
      }

      console.log('Step 1: Received match data:', JSON.stringify(matchData, null, 2));

      // Process player stats
      const processStats = (stats: any, playerNumber: number): PlayerStats => {
        try {
          console.log(`Step 2: Processing stats for player ${playerNumber}:`, JSON.stringify(stats, null, 2));
          
          if (!stats) {
            console.log(`Warning: No stats provided for player ${playerNumber}, using defaults`);
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

          console.log(`Step 2a: Processed stats for player ${playerNumber}:`, JSON.stringify(processedStats, null, 2));
          return processedStats;
        } catch (error) {
          console.error(`Error processing stats for player ${playerNumber}:`, error);
          console.error('Stats data that caused error:', JSON.stringify(stats, null, 2));
          throw new Error(`Failed to process stats for player ${playerNumber}: ${error.message}`);
        }
      };

      // Process innings data
      const processInnings = (innings: any[]): Turn[] => {
        try {
          console.log('Step 3: Processing innings data');
          
          if (!Array.isArray(innings)) {
            console.error('Innings is not an array:', innings);
            throw new Error('Innings must be an array');
          }

          const processedInnings = innings.filter(turn => turn != null).map((turn, index) => {
            try {
              console.log(`Step 3a: Processing turn ${index + 1}:`, JSON.stringify(turn, null, 2));
              
              const processedTurn = {
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
              
              console.log(`Step 3b: Processed turn ${index + 1}:`, JSON.stringify(processedTurn, null, 2));
              return processedTurn;
            } catch (error) {
              console.error(`Error processing turn ${index + 1}:`, error);
              console.error('Turn data that caused error:', JSON.stringify(turn, null, 2));
              throw error;
            }
          });

          console.log('Step 3c: Completed processing innings:', processedInnings.length, 'turns processed');
          return processedInnings;
        } catch (error) {
          console.error('Error processing innings:', error);
          console.error('Innings data that caused error:', JSON.stringify(innings, null, 2));
          throw new Error(`Failed to process innings: ${error.message}`);
        }
      };

      // Process player info
      const processPlayerInfo = (player: any, playerNumber: number): PlayerInfo => {
        try {
          console.log(`Step 4: Processing player ${playerNumber} info:`, JSON.stringify(player, null, 2));
          
          if (!player) {
            console.error(`Player ${playerNumber} info is missing`);
            throw new Error(`Player ${playerNumber} info is required`);
          }

          const processedPlayer = {
            name: String(player.name || `Unknown Player ${playerNumber}`),
            handicap: Number(player.handicap) || 0
          };

          console.log(`Step 4a: Processed player ${playerNumber} info:`, JSON.stringify(processedPlayer, null, 2));
          return processedPlayer;
        } catch (error) {
          console.error(`Error processing player ${playerNumber} info:`, error);
          console.error('Player data that caused error:', JSON.stringify(player, null, 2));
          throw new Error(`Failed to process player ${playerNumber} info: ${error.message}`);
        }
      };

      // Process the match data
      console.log('Step 5: Processing complete match data');
      const processedMatch = {
        userId: userId,
        gameType: matchData.gameType || '8-ball',
        player1: processPlayerInfo(matchData.player1, 1),
        player2: processPlayerInfo(matchData.player2, 2),
        player1Stats: processStats(matchData.player1Stats, 1),
        player2Stats: processStats(matchData.player2Stats, 2),
        innings: processInnings(matchData.innings),
        matchDate: new Date(matchData.matchDate || Date.now()),
        targetScore: Number(matchData.targetScore) || 0,
        duration: Number(matchData.duration) || 0,
        player1Score: Number(matchData.player1Score) || 0,
        player2Score: Number(matchData.player2Score) || 0,
        winner: matchData.winner ? processPlayerInfo(matchData.winner, matchData.winner.name === matchData.player1.name ? 1 : 2) : null
      };

      console.log('Step 6: Final processed match data:', JSON.stringify(processedMatch, null, 2));
      
      console.log('Step 7: Attempting to save match to database');
      const result = await this.matchesService.create(processedMatch);
      console.log('Step 8: Match saved successfully:', JSON.stringify(result, null, 2));
      
      return result;
    } catch (error) {
      console.error('Error in matches.controller.create:', error);
      if (error.name === 'ValidationError') {
        console.error('MongoDB Validation error details:', error.errors);
      }
      console.error('Stack trace:', error.stack);
      throw error;
    }
  }

  @Get()
  findAll(@Req() request: Request) {
    const userId = (request.user as any)?.userId;
    if (!userId) {
      throw new Error('User ID not found in token');
    }
    return this.matchesService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchesService.findById(id);
  }

  @Get('player/:playerId')
  findByPlayer(@Param('playerId') playerId: string) {
    return this.matchesService.findByPlayer(playerId);
  }

  @Delete(':id')
  async deleteMatch(@Param('id') id: string, @Req() request: Request) {
    const userId = (request.user as any)?.userId;
    if (!userId) {
      throw new Error('User ID not found in token');
    }
    return this.matchesService.delete(id, userId);
  }
} 