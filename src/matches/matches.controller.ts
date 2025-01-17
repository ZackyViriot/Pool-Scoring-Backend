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
      if (!Array.isArray(innings)) return [];

      return innings.filter(turn => turn != null).map((turn, index) => ({
        playerNumber: Number(turn.playerNumber) || 1,
        playerName: String(turn.playerName || `Player ${turn.playerNumber || 1}`),
        ballsPocketed: Number(turn.ballsPocketed) || 0,
        action: String(turn.action || 'unknown'),
        timestamp: new Date(turn.timestamp || Date.now()),
        score: Number(turn.score) || 0,
        inning: Number(turn.inning) || Math.floor(index / 2) + 1,
        isBreak: Boolean(turn.isBreak)
      }));
    };

    // Process player info
    const processPlayerInfo = (player: any): PlayerInfo => {
      if (!player) {
        return {
          name: 'Unknown Player',
          handicap: 0
        };
      }

      return {
        name: String(player.name || 'Unknown Player'),
        handicap: Number(player.handicap) || 0
      };
    };

    // Process the match data
    const processedMatch = {
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
    return this.matchesService.create(processedMatch);
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