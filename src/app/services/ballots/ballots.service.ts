import { Injectable } from '@angular/core';

import { Ballot } from '../../models/ballot';
import { DatabaseService } from '../../services/database';

@Injectable({
  providedIn: 'root'
})
export class BallotsService {
  constructor(private database: DatabaseService) {}
  _;

  async getAll(carShowId: number): Promise<Array<Ballot>> {
    const ballots: Array<Ballot> = [];
    await this.database.ready();
    await this.database.handle.transaction(tx =>
      tx.executeSql(
        'SELECT * FROM CarShowBallots WHERE carShowRid = ? ORDER BY timestamp',
        [carShowId],
        (_t, r) => {
          for (let i = 0; i < r.rows.length; i++) {
            ballots.push(r.rows.item(i));
          }
        }
      )
    );
    return ballots;
  }

  async save(ballot: Ballot): Promise<Ballot> {
    await this.database.ready();
    return ballot.id ? await this.update(ballot) : await this.addNew(ballot);
  }

  private async addNew(ballot: Ballot): Promise<Ballot> {
    const b = { ...ballot };
    await this.database.handle.transaction(tx => {
      tx.executeSql(
        'SELECT COALESCE(MAX(id), 0) + 1 AS newId FROM CarShowBallots',
        [],
        (_t, r) => {
          b.id = r.rows.item(0).newId;
          b.timestamp = new Date().toISOString();
        }
      );
      tx.executeSql(
        'INSERT INTO CarShowBallots (id, timestamp, carShowRid) VALUES (?, ?, ?)',
        [b.id, b.timestamp, b.carShowRid],
        () => {}
      );
    });
    return b;
  }

  private async update(ballot: Ballot): Promise<Ballot> {
    await this.database.handle.transaction(tx => {
      tx.executeSql(
        'UPDATE CarShowBallots SET carShowRid = ? WHERE id = ?',
        [ballot.carShowRid, ballot.id],
        () => {}
      );
    });
    return ballot;
  }
}
