import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VesselDocument = Vessel & Document;

enum NavigationStatusEnum {
  UNDERWAY_USING_ENGINE = 0,
  AT_ANCHOR = 1,
  NOT_UNDER_COMMAND = 2,
  RESTRICTED_MANEUVERABILITY = 3,
  CONSTRAINED_BY_DRAUGHT = 4,
  MOORED = 5,
  AGROUND = 6,
  ENGAGED_IN_FISHING = 7,
  UNDERWAY_SAILING = 8,
  RESERVED_FOR_FUTURE_USE = 9,
  RESERVED_FOR_FUTURE_USE2 = 10,
  POWER_DRIVEN_VESSEL_TOWING_ASTERN = 11,
  POWER_DRIVEN_VESSEL_PUSHING_AHEAD = 12,
  RESERVED_FOR_FUTURE_USE3 = 13,
  AIS_SART = 14,
  UNDEFINED = 15,
}

export type ShipStaticData = {
  MessageID: number; // Identifier for this type of message
  RepeatIndicator: number; // Indicates how many times the message has been repeated
  UserID: number; // MMSI number of the vessel
  Valid: boolean; // Indicates if the data is valid
  AisVersion: number; // Version of the AIS protocol
  ImoNumber: number; // IMO number of the vessel
  CallSign: string; // Call sign of the vessel
  Name: string; // Name of the vessel
  Type: number; // Type of vessel (e.g., cargo, tanker)
  Dimension: ShipStaticData_Dimension; // Dimensions of the vessel
  FixType: number; // Type of electronic position fixing device
  Eta: ShipStaticData_Eta; // Estimated time of arrival
  MaximumStaticDraught: number; // Maximum static draught of the vessel in meters
  Destination: string; // Destination of the vessel
  Dte: boolean; // Data terminal equipment (DTE) status
  Spare: boolean; // Reserved for future use
};

type ShipStaticData_Dimension = {
  Length: number; // Length of the vessel in meters
  Width: number; // Width of the vessel in meters
};

type ShipStaticData_Eta = {
  Month: number; // Estimated month of arrival
  Day: number; // Estimated day of arrival
  Hour: number; // Estimated hour of arrival
  Minute: number; // Estimated minute of arrival
};

export type PositionReportMessage = {
  PositionReport: {
    Cog: number;
    CommunicationState: number;
    Latitude: number;
    Longitude: number;
    MessageID: number;
    NavigationalStatus: NavigationStatusEnum;
    PositionAccuracy: boolean;
    Raim: boolean;
    RateOfTurn: number;
    RepeatIndicator: number;
    Sog: number;
    Spare: number;
    SpecialManoeuvreIndicator: number;
    Timestamp: number;
    TrueHeading: number;
    UserID: number;
    Valid: boolean;
  };
};

type PositionReportMeta = {
  MMSI: number;
  MMSI_String: string;
  ShipName: string;
  latitude: number;
  longitude: number;
  time_utc: string;
};

type BaseStationReport = {
  MessageID: number;
  RepeatIndicator: number;
  UserID: number;
  Valid: boolean;
  UtcYear: number;
  UtcMonth: number;
  UtcDay: number;
  UtcHour: number;
  UtcMinute: number;
  UtcSecond: number;
  PositionAccuracy: boolean;
  Longitude: number;
  Latitude: number;
  FixType: number;
  LongRangeEnable: boolean;
  Spare: number;
  Raim: boolean;
  CommunicationState: number;
};

@Schema()
export class Vessel {
  @Prop({ required: false, type: Object })
  Message:
    | {
        PositionReport: {
          Cog: number;
          CommunicationState: number;
          Latitude: number;
          Longitude: number;
          MessageID: number;
          NavigationalStatus: NavigationStatusEnum;
          PositionAccuracy: boolean;
          Raim: boolean;
          RateOfTurn: number;
          RepeatIndicator: number;
          Sog: number;
          Spare: number;
          SpecialManoeuvreIndicator: number;
          Timestamp: number;
          TrueHeading: number;
          UserID: number;
          Valid: boolean;
        };
      }
    | ShipStaticData
    | BaseStationReport
    | MultiSlotBinaryMessage;

  @Prop({ required: false })
  MessageType: string;

  @Prop({ required: false, type: Object })
  MetaData: {
    MMSI: number;
    MMSI_String: string;
    ShipName: string;
    latitude: number;
    longitude: number;
    time_utc: string;
  };
}

// The BaseStationReport AIS message is specifically designed to provide information about the location and
// status of a fixed AIS base station, such as a coastal station or a vessel traffic service (VTS) center.

@Schema()
export class BaseStation {
  @Prop({ required: false, type: Object })
  Message: {
    MessageID: number;
    RepeatIndicator: number;
    UserID: number;
    Valid: boolean;
    UtcYear: number;
    UtcMonth: number;
    UtcDay: number;
    UtcHour: number;
    UtcMinute: number;
    UtcSecond: number;
    PositionAccuracy: boolean;
    Longitude: number;
    Latitude: number;
    FixType: number;
    LongRangeEnable: boolean;
    Spare: number;
    Raim: boolean;
    CommunicationState: number;
  };

  @Prop({ required: false })
  MessageType: string;

  @Prop({ required: false, type: Object })
  MetaData: {
    MMSI: number;
    MMSI_String: string;
    ShipName: string;
    latitude: number;
    longitude: number;
    time_utc: string;
  };
}

type AddressedBinaryMessage_ApplicationID = {
  DesignatedAreaCode: number;
  FunctionIdentifier: number;
  Valid: boolean;
};

type MultiSlotBinaryMessage = {
  MessageID: number;
  RepeatIndicator: number;
  UserID: number;
  Valid: boolean;
  DestinationIDValid: boolean;
  ApplicationIDValid: boolean;
  DestinationID: number;
  Spare1: number;
  ApplicationID: AddressedBinaryMessage_ApplicationID;
  Payload: string;
  Spare2: number;
  CommunicationStateIsItdma: boolean;
  CommunicationState: number;
};

@Schema()
export class AddressedBinaryMessage {
  @Prop({ required: false, type: Object })
  Message: {
    MessageID: number;
    RepeatIndicator: number;
    UserID: number;
    Valid: boolean;
    DestinationIDValid: boolean;
    ApplicationIDValid: boolean;
    DestinationID: number;
    Spare1: number;
    ApplicationID: AddressedBinaryMessage_ApplicationID;
    Payload: string;
    Spare2: number;
    CommunicationStateIsItdma: boolean;
    CommunicationState: number;
  };

  @Prop({ required: false })
  MessageType: string;

  @Prop({ required: false, type: Object })
  MetaData: {
    MMSI: number;
    MMSI_String: string;
    ShipName: string;
    latitude: number;
    longitude: number;
    time_utc: string;
  };
}

export const VesselSchema = SchemaFactory.createForClass(Vessel);
export const BaseStationSchema = SchemaFactory.createForClass(BaseStation);
