import React, { useState, useEffect } from 'react';
import { get, some } from 'lodash';

export default function Table(game) {
  const [host, selectHost] = useState(null);
  const [buzzed, setBuzzer] = useState(
    some(game.G.queue, (o) => o.playerId === game.playerID)
  );

  useEffect(() => {
    if (game.G.queue.length === 0) {
      setBuzzer(false);
    }
  }, [game.G.queue]);

  if (game.ctx.phase === 'setHost') {
    return (
      <div>
        <select
          value={host}
          onChange={(e) => selectHost(e.currentTarget.value)}
        >
          <option value={null}></option>
          {game.gameMetadata.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
        <button onClick={() => game.moves.setHost(host)}>Confirm host</button>
      </div>
    );
  }

  return (
    <div>
      <button
        disabled={buzzed}
        onClick={() => {
          if (!buzzed) {
            game.moves.buzz(game.playerID, new Date().getTime());
            setBuzzer(true);
          }
        }}
      >
        Buzz
      </button>
      <button
        disabled={game.G.queue.length === 0}
        onClick={() => game.moves.resetBuzzers()}
      >
        Reset
      </button>
      <div>
        <div>Buzzed:</div>
        {game.G.queue.map(({ playerId, timestamp }, i) => (
          <div key={playerId}>
            {get(
              game.gameMetadata.find(
                (player) => String(player.id) === playerId
              ),
              'name'
            )}
            {i > 0 ? ` +${timestamp - game.G.queue[0].timestamp} ms` : null}
          </div>
        ))}
      </div>
    </div>
  );
}