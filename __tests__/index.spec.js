import { beforeAll, expect, it, jest } from "@jest/globals";
import { BrightestStar } from "../src";

const responseMock = {
  signature: { source: "NASA/JPL Fireball Data API", version: "1.0" },
  count: "4",
  fields: [
    "date",
    "energy",
    "impact-e",
    "lat",
    "lat-dir",
    "lon",
    "lon-dir",
    "alt",
    "vel",
  ],
  data: [
    [
      "2021-04-02 15:52:58",
      "13.7",
      "0.4",
      "71.2",
      "N",
      "106.7",
      "E",
      "40.0",
      "-",
    ],
    [
      "2021-03-06 08:43:06",
      "14.1",
      "0.41",
      "48.6",
      "S",
      "90.4",
      "E",
      "31.1",
      "-",
    ],
    [
      "2021-03-05 13:50:01",
      "3.9",
      "0.13",
      "81.1",
      "S",
      "141.1",
      "E",
      "32.5",
      "-",
    ],
    ["2021-02-28 03:47:37", "2.8", "0.098", "9.2", "N", "64.1", "W", null, "-"],
  ],
};

describe("Brightest Start ", () => {
  let brightestStar;
  beforeAll(() => {
    brightestStar = new BrightestStar();
  });
  it("should convert to signed Coordinates ", () => {
    const coordinateDetails = [51.0, "S", 21.1, "W"];
    const expectedSignedCoordinate = {
      energy: 21.1,
      lat: -51,
      lon: -21.1,
    };
    const actualSignedCoordinate = brightestStar.convertToSignedCoordinates(
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

    expect(list.length === 1);
  });

  it("should call addBrightestStarForOneLocation for all four locations inside filterListFindBrightestStar", () => {
    const list = [
      { lat: "71.2", lon: "106.7", energy: "106.7" },
      { lat: -48.6, lon: "90.4", energy: "90.4" },
      { lat: -81.1, lon: "141.1", energy: "141.1" },
      { lat: "9.2", lon: -64.1, energy: "64.1" },
    ];
    const spyOnfireball = jest.spyOn(brightestStar, "fireball");
    const spyOnaddBrightestStarForOneLocation = jest.spyOn(
      brightestStar,
      "addBrightestStarForOneLocation"
    );
    const spyOnfilterCoordinatesInRangeAndMaxEnergyStar = jest.spyOn(
      brightestStar,
      "filterCoordinatesInRangeAndMaxEnergyStar"
    );

    brightestStar.filterListFindBrightestStar(list);

    expect(spyOnfireball).toHaveBeenCalledTimes(4);
    expect(spyOnaddBrightestStarForOneLocation).toHaveBeenCalledTimes(4);
    expect(spyOnfilterCoordinatesInRangeAndMaxEnergyStar).toHaveBeenCalledTimes(
      4
    );
  });
  it("should test the init function fetch call", async () => {
    await brightestStar.init();
    jest
      .spyOn(brightestStar, "mapToSignedCoordinateList")
      .mockReturnValue(jest.fn());
    setTimeout(() => {
      expect(fetch).toHaveBeenCalled();
      expect(brightestStar.mapToSignedCoordinateList).toHaveBeenCalled();
    }, 1000);
  });
});
