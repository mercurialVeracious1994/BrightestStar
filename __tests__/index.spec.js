import { beforeAll, expect, it } from "@jest/globals";
import { BrightestStar } from "../src";

describe("Brightest Start ", () => {
    let brightestStar;
    beforeAll(()=>{
        brightestStar=  new BrightestStar();
    })
  it("should convert to signed Coordinates ", () => {
    const coordinateDetails = [51.0, "S", 21.1, "W"];
    const expectedSignedCoordinate = {
      energy: 21.1,
      lat: -51,
      lon: -21.1,
    };
    const actualSignedCoordinate =  brightestStar.convertToSignedCoordinates(
      coordinateDetails,
      1,
      0,
      3,
      2
    );

    expect(actualSignedCoordinate).toStrictEqual(expectedSignedCoordinate);
  });

  it("should give range of coordinate for coordinates specified", () => {
    const expectedCoordinateRange1 = {
      latRange: { max: 66, min: -36 },
      lonRange: { max: 36.1, min: 6.100000000000001 },
    };
    const expectedCoordinateRange2 = {
      latRange: { max: 66, min: -36 },
      lonRange: { max: -36.1, min: -6.100000000000001 },
    };
    const expectedCoordinateRange3 = {
      latRange: { max: 66, min: 36 },
      lonRange: { max: -36.1, min: -6.100000000000001 },
    };
    const expectedCoordinateRange4 = {
      latRange: { max: 66, min: 36 },
      lonRange: { max: 36.1, min: 6.100000000000001 },
    };
    const actualCoordinateRange1 = brightestStar.fireball(-51.0, 21.1);
    const actualCoordinateRange2 = brightestStar.fireball(-51.0, -21.1);
    const actualCoordinateRange3 = brightestStar.fireball(51.0, -21.1);
    const actualCoordinateRange4 = brightestStar.fireball(51.0, 21.1);

    expect(actualCoordinateRange1).toStrictEqual(expectedCoordinateRange1);
    expect(actualCoordinateRange2).toStrictEqual(expectedCoordinateRange2);
    expect(actualCoordinateRange3).toStrictEqual(expectedCoordinateRange3);
    expect(actualCoordinateRange4).toStrictEqual(expectedCoordinateRange4);
  });

  it("should push the brightest of one location star to the list", () => {
    const brightStar = { energy: 21.1, lat: -51, lon: -21.1 };
    const list = [];
    brightestStar.addBrightestStarForOneLocation(list, brightStar);

    expect(list.length===1);
  });

//   it("should call addBrightestStarForOneLocation for all four locations inside filterListFindBrightestStar",()=>{
//     brightestStar.filterListFindBrightestStar();
//       expect(brightestStar.fireball).toHaveBeenCalledTimes(4);
//       expect(brightestStar.addBrightestStarForOneLocation).toHaveBeenCalledTimes(4);
//       expect(Brightest.filterCoordinatesInRangeAndMaxEnergyStar).toHaveBeenCalledTimes(4);
//   })
});
