import { CheckPos as CheckDir } from "./checkPos.js";
import { Elf, Point } from "./elf.js";

export class ElfSpread {
  public elves: Map<string, Elf> = new Map();
  private _rowNum: number = 10;

  public readLine(line: string) {
    for (let i = 0; i < line.length; i++) {
      const char = line.charAt(i);
      if (char === "#") {
        const elf = new Elf();
        const pointToAdd = new Point(i, this._rowNum);
        this.elves.set(JSON.stringify(pointToAdd), elf);
      }
    }
    this._rowNum--;
  }

  public spread(rounds: number) {
    const dirsToCheck = CheckDir.allCheckDirs();

    for (let round = 0; round < rounds; round++) {
      let nextRoundElves: Map<string, Elf> = new Map();

      for (const [pointStr, elf] of this.elves) {
        const point: Point = JSON.parse(pointStr);
        const candidateMovements: Point[] = [];

        for (let i = 0; i < dirsToCheck.length; i++) {
          const index = (i + round) % dirsToCheck.length;
          const dirToCheck = dirsToCheck[index];
          let isBusy = false;
          for (const pointMovement of dirToCheck.adyacentPositions(point)) {
            if (this.elves.has(JSON.stringify(pointMovement))) {
              isBusy = true;
              break;
            }
          }
          if (!isBusy) {
            candidateMovements.push(dirToCheck.adyacentPos(point));
          }
        }

        //If no other Elves are in one of those eight positions, the Elf does not do anything during this round + no valid direction
        if (
          candidateMovements.length === dirsToCheck.length ||
          candidateMovements.length === 0
        ) {
          nextRoundElves.set(pointStr, elf);
          continue;
        }

        const nextPoint = candidateMovements[0];
        const nextPointStr = JSON.stringify(nextPoint);

        //If two or more Elves propose moving to the same position, none of those Elves move
        if (nextRoundElves.has(nextPointStr)) {
          const undoElf = nextRoundElves.get(nextPointStr);
          nextRoundElves.delete(nextPointStr);
          const undoPointStr = JSON.stringify(undoElf.lastMove);
          nextRoundElves.set(undoPointStr, undoElf);
          nextRoundElves.set(pointStr, elf);
          continue;
        }

        elf.lastMove = point;
        nextRoundElves.set(nextPointStr, elf);
      }

      this.elves = nextRoundElves;
    }
  }

  public getCornerCoordinates(): Point[] {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const pointJson of this.elves.keys()) {
      const point: Point = JSON.parse(pointJson);
      minX = Math.min(point.x, minX);
      minY = Math.min(point.y, minY);
      maxX = Math.max(point.x, maxX);
      maxY = Math.max(point.y, maxY);
    }

    return [new Point(minX, maxY), new Point(maxX, minY)];
  }

  public currentArea(): number {
    const [upLeft, downRight] = this.getCornerCoordinates();
    return (downRight.x - upLeft.x + 1) * (upLeft.y - downRight.y + 1);
  }

  public printElves(): string {
    const [upLeft, downRight] = this.getCornerCoordinates();
    let output = "";
    for (let y = upLeft.y; y >= downRight.y; y--) {
      for (let x = upLeft.x; x <= downRight.x; x++) {
        const point = new Point(x, y);
        const isThereElf = this.elves.has(JSON.stringify(point));
        output += isThereElf ? "#" : ".";
      }
      output += "\n";
    }
    output = output.substring(0, output.length - 1);
    return output;
  }
}
