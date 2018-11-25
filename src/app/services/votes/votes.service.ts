import { Injectable } from '@angular/core';

import { DatabaseService } from '../database';
import { Vote } from '../../models/vote';

@Injectable({
  providedIn: 'root'
})
export class VotesService {
  constructor(private database: DatabaseService) {}

  async getAll(carShowId: number): Promise<Array<Vote>> {
    return this.getVotes(
      'SELECT CarShowBallotVotes.* FROM CarShowBallotVotes' +
        ' JOIN CarShowBallots ON CarShowBallots.id = CarShowBallotVotes.carShowBallotRid' +
        ' WHERE CarShowBallots.carShowRid = ?',
      carShowId
    );
  }

  async getBallotVotes(ballotId: number): Promise<Array<Vote>> {
    return this.getVotes(
      'SELECT * FROM CarShowBallotVotes WHERE carShowBallotRid = ?',
      ballotId
    );
  }

  async save(vote: Vote): Promise<Vote> {
    await this.database.ready();
    if (vote.carNumber) {
      return vote.id ? await this.update(vote) : await this.addNew(vote);
    } else if (vote.id) {
      await this.delete(vote);
    }
    return null;
  }

  private async addNew(vote: Vote): Promise<Vote> {
    const v = { ...vote };
    await this.database.handle.transaction(tx => {
      tx.executeSql(
        'SELECT COALESCE(MAX(id), 0) + 1 AS newId FROM CarShowBallotVotes',
        [],
        (_t, r) => {
          v.id = r.rows.item(0).newId;
        }
      );
      tx.executeSql(
        'INSERT INTO CarShowBallotVotes (id, carShowBallotRid, carShowClassRid, carNumber) VALUES (?, ?, ?, ?)',
        [v.id, v.carShowBallotRid, v.carShowClassRid, v.carNumber],
        () => {}
      );
    });
    return v;
  }

  private async delete(vote: Vote): Promise<void> {
    await this.database.handle.transaction(tx =>
      tx.executeSql(
        'DELETE FROM CarShowBallotVotes WHERE id = ?',
        [vote.id],
        () => {}
      )
    );
  }

  private async update(vote: Vote): Promise<Vote> {
    await this.database.handle.transaction(tx => {
      tx.executeSql(
        'UPDATE CarShowBallotVotes SET carShowBallotRid = ?, carShowClassRid = ?, carNumber = ? WHERE id = ?',
        [vote.carShowBallotRid, vote.carShowClassRid, vote.carNumber, vote.id],
        () => {}
      );
    });
    return vote;
  }

  private async getVotes(sql: string, id: number): Promise<Array<Vote>> {
    const votes: Array<Vote> = [];
    await this.database.ready();
    this.database.handle.transaction(tx =>
      tx.executeSql(sql, [id], (_t, r) => {
        for (let i = 0; i < r.rows.length; i++) {
          votes.push(r.rows.item(i));
        }
      })
    );
    return votes;
  }
}
