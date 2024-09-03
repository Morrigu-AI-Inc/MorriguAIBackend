export class Amazon {}
// Example of a PunchOut Order Message (POM) from Amazon:
// {
//     "cXML": {
//       "$": {
//         "payloadID": "1724975228612.558.5862@amazon.com",
//         "timestamp": "2024-08-29T23:47:08.619Z"
//       },
//       "Header": [
//         {
//           "From": [
//             {
//               "Credential": [
//                 {
//                   "$": {
//                     "domain": "DUNS"
//                   },
//                   "Identity": [
//                     "128990368"
//                   ]
//                 },
//                 {
//                   "$": {
//                     "domain": "NetworkId"
//                   },
//                   "Identity": [
//                     "Amazon"
//                   ]
//                 }
//               ]
//             }
//           ],
//           "To": [
//             {
//               "Credential": [
//                 {
//                   "$": {
//                     "domain": "NetworkId"
//                   },
//                   "Identity": [
//                     "RiguAI7376222135"
//                   ]
//                 }
//               ]
//             }
//           ],
//           "Sender": [
//             {
//               "Credential": [
//                 {
//                   "$": {
//                     "domain": "DUNS"
//                   },
//                   "Identity": [
//                     "128990368"
//                   ]
//                 },
//                 {
//                   "$": {
//                     "domain": "NetworkId"
//                   },
//                   "Identity": [
//                     "Amazon"
//                   ]
//                 }
//               ],
//               "UserAgent": [
//                 "Amazon LLC eProcurement Application"
//               ]
//             }
//           ]
//         }
//       ],
//       "Message": [
//         {
//           "PunchOutOrderMessage": [
//             {
//               "BuyerCookie": [
//                 "jason.dee.walker@gmail.com"
//               ],
//               "PunchOutOrderMessageHeader": [
//                 {
//                   "$": {
//                     "operationAllowed": "create"
//                   },
//                   "Total": [
//                     {
//                       "Money": [
//                         {
//                           "_": "6.99",
//                           "$": {
//                             "currency": "USD"
//                           }
//                         }
//                       ]
//                     }
//                   ],
//                   "Shipping": [
//                     {
//                       "Money": [
//                         {
//                           "_": "2.99",
//                           "$": {
//                             "currency": "USD"
//                           }
//                         }
//                       ],
//                       "Description": [
//                         {
//                           "_": "Cost of shipping, not including shipping tax.",
//                           "$": {
//                             "xml:lang": "en-US"
//                           }
//                         }
//                       ]
//                     }
//                   ],
//                   "Tax": [
//                     {
//                       "Money": [
//                         {
//                           "_": "0.00",
//                           "$": {
//                             "currency": "USD"
//                           }
//                         }
//                       ],
//                       "Description": [
//                         {
//                           "_": "Cost of tax, including shipping tax.",
//                           "$": {
//                             "xml:lang": "en-US"
//                           }
//                         }
//                       ]
//                     }
//                   ]
//                 }
//               ],
//               "ItemIn": [
//                 {
//                   "$": {
//                     "quantity": "1"
//                   },
//                   "ItemID": [
//                     {
//                       "SupplierPartID": [
//                         "B074J5TWYL"
//                       ],
//                       "SupplierPartAuxiliaryID": [
//                         "136-4982173-3109337,1"
//                       ]
//                     }
//                   ],
//                   "ItemDetail": [
//                     {
//                       "UnitPrice": [
//                         {
//                           "Money": [
//                             {
//                               "_": "6.99",
//                               "$": {
//                                 "currency": "USD"
//                               }
//                             }
//                           ]
//                         }
//                       ],
//                       "Description": [
//                         {
//                           "_": "365 by Whole Foods Market, Tea Black Organic, 70 Count",
//                           "$": {
//                             "xml:lang": "en-US"
//                           }
//                         }
//                       ],
//                       "UnitOfMeasure": [
//                         "EA"
//                       ],
//                       "Classification": [
//                         {
//                           "_": "50201700",
//                           "$": {
//                             "domain": "UNSPSC"
//                           }
//                         }
//                       ],
//                       "ManufacturerPartID": [
//                         "0099482414832"
//                       ],
//                       "ManufacturerName": [
//                         "365 by Whole Foods Market"
//                       ],
//                       "Extrinsic": [
//                         {
//                           "_": "Amazon.com Services, Inc",
//                           "$": {
//                             "name": "soldBy"
//                           }
//                         },
//                         {
//                           "_": "Amazon",
//                           "$": {
//                             "name": "fulfilledBy"
//                           }
//                         },
//                         {
//                           "_": "OFFICE_PRODUCTS",
//                           "$": {
//                             "name": "category"
//                           }
//                         },
//                         {
//                           "_": "GENERAL_OFFICE_SUPPLIES",
//                           "$": {
//                             "name": "subCategory"
//                           }
//                         },
//                         {
//                           "_": "New",
//                           "$": {
//                             "name": "itemCondition"
//                           }
//                         },
//                         {
//                           "_": "true",
//                           "$": {
//                             "name": "qualifiedOffer"
//                           }
//                         },
//                         {
//                           "_": "UPC-099482414832",
//                           "$": {
//                             "name": "UPC"
//                           }
//                         },
//                         {
//                           "_": "https://www.amazon.com/dp/B074J5TWYL",
//                           "$": {
//                             "name": "detailPageURL"
//                           }
//                         },
//                         {
//                           "_": "0099482414832",
//                           "$": {
//                             "name": "ean"
//                           }
//                         },
//                         {
//                           "_": "default",
//                           "$": {
//                             "name": "preference"
//                           }
//                         }
//                       ]
//                     }
//                   ],
//                   "Shipping": [
//                     {
//                       "Money": [
//                         {
//                           "_": "2.99",
//                           "$": {
//                             "currency": "USD"
//                           }
//                         }
//                       ],
//                       "Description": [
//                         {
//                           "_": "Cost of shipping, not including shipping tax.",
//                           "$": {
//                             "xml:lang": "en-US"
//                           }
//                         }
//                       ]
//                     }
//                   ],
//                   "Tax": [
//                     {
//                       "Money": [
//                         {
//                           "_": "0.00",
//                           "$": {
//                             "currency": "USD"
//                           }
//                         }
//                       ],
//                       "Description": [
//                         {
//                           "_": "Cost of tax, including shipping tax.",
//                           "$": {
//                             "xml:lang": "en-US"
//                           }
//                         }
//                       ]
//                     }
//                   ]
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     }
//   }

type PunchOutOrderMessage = {
    BuyerCookie: string[];
    PunchOutOrderMessageHeader: {
      $: {
        operationAllowed: string;
      };
      Total: {
        Money: {
          _: string;
          $: {
            currency: string;
          };
        }[];
      }[];
      Shipping: {
        Money: {
          _: string;
          $: {
            currency: string;
          };
        }[];
        Description: {
          _: string;
          $: {
            "xml:lang": string;
          };
        }[];
      }[];
      Tax: {
        Money: {
          _: string;
          $: {
            currency: string;
          };
        }[];
        Description: {
          _: string;
          $: {
            "xml:lang": string;
          };
        }[];
      }[];
    }[];
    ItemIn: {
      $: {
        quantity: string;
      };
      ItemID: {
        SupplierPartID: string[];
        SupplierPartAuxiliaryID: string[];
      }[];
      ItemDetail: {
        UnitPrice: {
          Money: {
            _: string;
            $: {
              currency: string;
            };
          }[];
        }[];
        Description: {
          _: string;
          $: {
            "xml:lang": string;
          };
        }[];
        UnitOfMeasure: string[];
        Classification: {
          _: string;
          $: {
            domain: string;
          };
        }[];
        ManufacturerPartID: string[];
        ManufacturerName: string[];
        Extrinsic: {
          _: string;
          $: {
            name: string;
          };
        }[];
      }[];
      Shipping: {
        Money: {
          _: string;
          $: {
            currency: string;
          };
        }[];
        Description: {
          _: string;
          $: {
            "xml:lang": string;
          };
        }[];
      }[];
      Tax: {
        Money: {
          _: string;
          $: {
            currency: string;
          };
        }[];
        Description: {
          _: string;
          $: {
            "xml:lang": string;
          };
        }[];
      }[];
    }[];
  };
  
  type Credential = {
    $: {
      domain: string;
    };
    Identity: string[];
  };
  
  type Header = {
    From: {
      Credential: Credential[];
    }[];
    To: {
      Credential: Credential[];
    }[];
    Sender: {
      Credential: Credential[];
      UserAgent: string[];
    }[];
  };
  
  type Message = {
    PunchOutOrderMessage: PunchOutOrderMessage[];
  }[];
  
  export type CXML = {
    $: {
      payloadID: string;
      timestamp: string;
    };
    Header: Header[];
    Message: Message;
  };
  
  export type PunchOutOrder = {
    cXML: CXML;
  };