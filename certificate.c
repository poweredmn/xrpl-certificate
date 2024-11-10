#include <stdint.h>
#include "hookapi.h"

int64_t hook(int32_t reserved)
{
    // Buffer for storing memo hash
    uint8_t memo_hash[32];
    uint8_t timestamp_buf[8]; // Buffer for reading existing timestamp

    // Check if memo field exists
    if (otxn_field(0, 0, sfMemoData) < 0)
    {
        rollback(SBUF("Transaction must contain a memo field."), 10);
        return 1;
    }

    // Read memo data from transaction
    int64_t memo_len = otxn_field(SBUF(memo_hash), sfMemoData);
    if (memo_len != sizeof(memo_hash))
    {
        rollback(SBUF("Transaction must contain a 32-byte hashed memo."), 20);
        return 1;
    }

    // Check if memo hash exists in state
    int64_t existing_timestamp = state(SBUF(timestamp_buf), SBUF(memo_hash));

    _g(1, 1); // Guard for the single iteration

    if (existing_timestamp > 0)
    { // Valid timestamp found
        // Use trace_num to output the timestamp
        trace_num(SBUF("Existing timestamp: "), existing_timestamp);
        accept(SBUF("Timestamp found"), 0);
        return existing_timestamp;
    }

    // Get current ledger sequence as timestamp
    int64_t current_timestamp = ledger_seq();

    // Store the timestamp with memo hash as key
    int64_t state_result = state_set(SBUF(current_timestamp), SBUF(memo_hash));

    if (state_result < 0)
    {
        rollback(SBUF("Failed to store timestamp"), state_result);
        return state_result;
    }

    // Use trace_num to output the new timestamp
    trace_num(SBUF("Stored new timestamp: "), current_timestamp);
    accept(SBUF("New timestamp stored"), 0);
    return 0;
}