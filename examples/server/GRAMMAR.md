# Smol Grammar Test

Getting a sense of how much slower the server is with a grammar. Heres how to get started:

```bash
mkdir build
cd build
cmake -DLLAMA_METAL=1 -DLLAMA_BUILD_SERVER=1 ..
cmake --build . --config Release
```

### Notes
- llama-2-7b-chat.ggmlv3.q2_K.bin
- Apple M1 Pro 32GB

## With Grammar

```bash
# $ bin/server -t 4 -ngl 2000000 -m ../models/llama-2-7b-chat.ggmlv3.q2_K.bin --grammar ../compiled_grammar.txt

# run 1 (from cold start)
llama_print_timings:        load time =  5640.81 ms
llama_print_timings:      sample time =    48.95 ms /    59 runs   (    0.83 ms per token,  1205.19 tokens per second)
llama_print_timings: prompt eval time =  5639.26 ms /   169 tokens (   33.37 ms per token,    29.97 tokens per second)
llama_print_timings:        eval time =  3375.64 ms /    58 runs   (   58.20 ms per token,    17.18 tokens per second)
llama_print_timings:       total time = 29153.40 ms

# run 2 (from cold start)
llama_print_timings:        load time =  5750.85 ms
llama_print_timings:      sample time =    48.53 ms /    59 runs   (    0.82 ms per token,  1215.77 tokens per second)
llama_print_timings: prompt eval time =  5749.25 ms /   169 tokens (   34.02 ms per token,    29.40 tokens per second)
llama_print_timings:        eval time =  4129.93 ms /    58 runs   (   71.21 ms per token,    14.04 tokens per second)
llama_print_timings:       total time = 30095.50 ms

# run 3 (from hot prompt start)
llama_print_timings:        load time =  5750.85 ms
llama_print_timings:      sample time =    48.45 ms /    59 runs   (    0.82 ms per token,  1217.67 tokens per second)
llama_print_timings: prompt eval time =     0.00 ms /     1 tokens (    0.00 ms per token,      inf tokens per second)
llama_print_timings:        eval time =  3572.85 ms /    59 runs   (   60.56 ms per token,    16.51 tokens per second)
llama_print_timings:       total time = 23728.72 ms
```

```json
// response
{
	"content": "{ \"country\": \"UK\" , \"population\": 8000000 , \"percent_retired\": 10 , \"head_of_state\": [\"Prime Minister David Cameron\", \"Lord Mayor of London Boris Johnson\"] }",
    // snip
}
```

## Without Grammar

```bash
# $ bin/server -t 4 -ngl 2000000 -m ../models/llama-2-7b-chat.ggmlv3.q2_K.bin

# run 1 (from cold start)
llama_print_timings:        load time =  5770.82 ms
llama_print_timings:      sample time =    82.37 ms /   100 runs   (    0.82 ms per token,  1214.06 tokens per second)
llama_print_timings: prompt eval time =  5769.86 ms /   169 tokens (   34.14 ms per token,    29.29 tokens per second)
llama_print_timings:        eval time =  5173.65 ms /    99 runs   (   52.26 ms per token,    19.14 tokens per second)
llama_print_timings:       total time = 11035.54 ms

# run 2 (from cold start)
llama_print_timings:        load time =  5702.22 ms
llama_print_timings:      sample time =    82.25 ms /   100 runs   (    0.82 ms per token,  1215.81 tokens per second)
llama_print_timings: prompt eval time =  5701.75 ms /   169 tokens (   33.74 ms per token,    29.64 tokens per second)
llama_print_timings:        eval time =  4822.17 ms /    99 runs   (   48.71 ms per token,    20.53 tokens per second)
llama_print_timings:       total time = 10616.36 ms

# run 3 (from hot prompt start)
llama_print_timings:        load time =  5702.22 ms
llama_print_timings:      sample time =    84.23 ms /   100 runs   (    0.84 ms per token,  1187.24 tokens per second)
llama_print_timings: prompt eval time =     0.00 ms /     1 tokens (    0.00 ms per token,      inf tokens per second)
llama_print_timings:        eval time =  4914.29 ms /   100 runs   (   49.14 ms per token,    20.35 tokens per second)
llama_print_timings:       total time =  5008.80 ms
```

```json
// response
{
	"content": " \" {'country': 'UK', 'population': 8000000 , 'percent_retired': 10 , 'head_of_state': 'Mayor Johnson' }\" \n Sydney \" {'country': 'Australia', 'population': 5000000 , 'percent_retired': 20 , 'head_of_state': 'Mayor Clover' }\" \n Moscow \" {'country':",
    // snip
}
```

### Request

```bash
curl --request POST \
  --url http://localhost:8080/completion \
  --header 'Content-Type: application/json' \
  --data '{
	"prompt": "Youre a helpful assiant who answer questions about locations in JSON format. New York \"{ '\''country'\'': '\''US'\'' , '\''population'\'': 8000000 , '\''percent_retired'\'': 10 , '\''head_of_state'\'': '\''Mayor Bloomberg'\'' }\" \n California \"{ '\''country'\'': '\''US'\'' , '\''population'\'': 4000000 , '\''percent_retired'\'': 5 , '\''head_of_state'\'': '\''Governor Schwarzenegger'\'' }\" \n Paris \"{ '\''country'\'': '\''France'\'' , '\''population'\'': 2000000 , '\''percent_retired'\'': 15 , '\''head_of_state'\'': '\''Mayor Delanoe'\'' } \n London",
	"temperature": 0,
	"n_predict": 100
}'
```

## Conclusion

The grammar is a bit slower, percentage wise it incurrs about a 30% slowdown (mainly due to the accept_token step).
