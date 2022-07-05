export type TalkanaType = {
    "version": "0.1.0",
    "name": "talkana",
    "instructions": [
      {
        "name": "sendMessage",
        "accounts": [
          {
            "name": "message",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "author",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "topic",
            "type": "string"
          },
          {
            "name": "content",
            "type": "string"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "message",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "author",
              "type": "publicKey"
            },
            {
              "name": "timestamp",
              "type": "i64"
            },
            {
              "name": "topic",
              "type": "string"
            },
            {
              "name": "content",
              "type": "string"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "TopicLimitExceeded",
        "msg": "Topic characters count shouldn't exceed 16!"
      },
      {
        "code": 6001,
        "name": "ContentLimitExceeded",
        "msg": "Content characters count shouldn't exceed 64!"
      }
    ]
  };
  
  export const IDL: TalkanaType = {
    "version": "0.1.0",
    "name": "talkana",
    "instructions": [
      {
        "name": "sendMessage",
        "accounts": [
          {
            "name": "message",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "author",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "topic",
            "type": "string"
          },
          {
            "name": "content",
            "type": "string"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "message",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "author",
              "type": "publicKey"
            },
            {
              "name": "timestamp",
              "type": "i64"
            },
            {
              "name": "topic",
              "type": "string"
            },
            {
              "name": "content",
              "type": "string"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "TopicLimitExceeded",
        "msg": "Topic characters count shouldn't exceed 16!"
      },
      {
        "code": 6001,
        "name": "ContentLimitExceeded",
        "msg": "Content characters count shouldn't exceed 64!"
      }
    ]
  };
  