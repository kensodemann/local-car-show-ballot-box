import { Injectable } from '@angular/core';

import { DbTransaction, SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

interface Column {
  name: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public handle: SQLiteObject;
  private readyPromise: Promise<boolean>;
  private isReady = false;

  constructor(private sqlite: SQLite) {
    this.readyPromise = this.initializeSchema();
  }

  async ready(): Promise<boolean> {
    if (!this.isReady) {
      await this.readyPromise;
    }
    return true;
  }

  private async initializeSchema(): Promise<boolean> {
    await this.open();
    return this.handle
      .transaction(tx => {
        this.createTables(tx);
      })
      .then(() => {
        this.isReady = true;
        return true;
      });
  }

  private async open(): Promise<void> {
    this.handle = await this.sqlite.create({
      name: 'carshow.db',
      location: 'default'
    });
  }

  private createTables(transaction: DbTransaction): void {
    const id = { name: 'id', type: 'INTEGER PRIMARY KEY' };
    const name = { name: 'name', type: 'TEXT' };
    const description = { name: 'description', type: 'TEXT' };
    transaction.executeSql(
      this.createTableSQL('CarClasses', [
        id,
        name,
        description,
        { name: 'active', type: 'INTEGER' }
      ])
    );
    transaction.executeSql(
      this.createTableSQL('CarShows', [
        id,
        name,
        { name: 'date', type: 'TEXT' },
        { name: 'year', type: 'INTEGER' }
      ])
    );
    transaction.executeSql(
      this.createTableSQL('CarShowClasses', [
        id,
        name,
        description,
        { name: 'active', type: 'INTEGER' },
        { name: 'carShowRid', type: 'INTEGER' }
      ])
    );
    transaction.executeSql(
      this.createTableSQL('CarShowBallots', [
        id,
        { name: 'carShowRid', type: 'INTEGER' }
      ])
    );
    transaction.executeSql(
      this.createTableSQL('CarShowBallotVotes', [
        id,
        { name: 'carShowBallotRid', type: 'INTEGER' },
        { name: 'carShowClassRid', type: 'INTEGER' },
        { name: 'carNumber', type: 'INTEGER' }
      ])
    );
  }

  private createTableSQL(name: string, columns: Array<Column>): string {
    let cols = '';
    columns.forEach((c, i) => {
      cols += `${i ? ', ' : ''}${c.name} ${c.type}`;
    });
    return `CREATE TABLE IF NOT EXISTS ${name} (${cols})`;
  }
}
