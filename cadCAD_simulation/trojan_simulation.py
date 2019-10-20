import numpy as np
import pandas as pd
import matplotlib
import matplotlib.pyplot as plt
from cadCAD.configuration import Configuration
from cadCAD.engine import ExecutionMode, ExecutionContext, Executor

np.set_printoptions(formatter={'float': lambda x: "{0:0.2f}".format(x)})

initial_conditions = {
  'BC_reserve': 0,
  'token_holders': np.zeros(8),
  'n': 8, # max number of token holders including guildbank and DAO pool
  'DAO_pool_index': 0,
  'guildbank_index': 1,
  'amount_to_mint': 100, # in eth
  'percent_to_burn': 0.2, # proportion of holdings
  'price': 1, # in eth/tok
  'total_tokens': 0,
  'action': 'mint',
  'DAO_tax_rate': 0.02,
  'redist_tax_rate': 0.01,
  'burn_tax_rate': 0.03,
  'redist': 0,
}

def choose_action(params, step, sL, s):
  index = np.random.randint(2, s['n'])
  p = np.random.randint(0, 100)
  action = 'mint'
  if (p > 50):
    action = 'burn'
  print("Carry out %s at index %s" % (action, index))
  return ({'action': action, 'update_index': index})

def update_BC_reserve(params, step, sL, s, _input):
  y = 'BC_reserve'
  action = _input['action']
  i = _input['update_index']
  x = s['BC_reserve']
  if (action == 'mint'):
    x = x + s['amount_to_mint']
  elif (action == 'burn'):
    x = x - s['percent_to_burn'] * s['token_holders'][i] * (1 - s['burn_tax_rate'])
  print("Reserve (eth): %s" % (x))
  return (y, x)

def update_total_tokens(params, step, sL, s, _input):
  y = 'total_tokens'
  action = _input['action']
  i = _input['update_index']
  x = s['total_tokens']
  if (action == 'mint'):
    x = x + s['amount_to_mint']
  elif (action == 'burn'):
    x = x - s['percent_to_burn'] * s['token_holders'][i] * (1 - s['burn_tax_rate'])
  print("Total (tok): %s" % (x))
  return (y, x)

def update_token_holders(params, step, sL, s, _input):
  y = 'token_holders'
  action = _input['action']
  x = s['token_holders'].copy()
  i = _input['update_index']
  if (action == 'mint'):
    x[i] = x[i] + s['amount_to_mint'] * (1 - s['DAO_tax_rate'] - s['redist_tax_rate'])
    DAO_tax_amount = s['amount_to_mint'] * s['DAO_tax_rate']
    x[0] = x[0] + DAO_tax_amount
  elif (action == 'burn'):
    x[i] = x[i] - s['percent_to_burn'] * x[i]
    DAO_tax_amount = s['percent_to_burn'] * x[i] * s['burn_tax_rate']
    x[0] = x[0] + DAO_tax_amount
  print(x)
  return (y, x)

def update_redistribution_amount(params, step, sL, s, _input):
  y = 'redist'
  action = _input['action']
  x = 0
  if (action == 'mint'):
    x = s['amount_to_mint'] * s['redist_tax_rate']
  print("Redistribution tax (tok): %s" % (x))
  return (y, x)

def redistribute(params, step, sL, s, _input):
  y = 'token_holders'
  x = s['token_holders']
  n = s['n']
  redist = s['redist']
  total_tokens = s['total_tokens']
  if (redist > 0 and total_tokens > 0):
    print("Redistribute %s based on total %s" % (redist, total_tokens))
    for i in range(0, n):
      x[i] = x[i] + redist * x[i] / total_tokens
    print(x)
  print('\n')
  return (y, x)

partial_state_update_blocks = [
    { 
        'policies': {
            'choose_action': choose_action,
        },
        'variables': {
            'BC_reserve': update_BC_reserve,
            'token_holders': update_token_holders,
            'redist': update_redistribution_amount,
            'total_tokens': update_total_tokens,
        }
    },
    { 
        'policies': {
        },
        'variables': {
            'token_holders': redistribute,
        }
    }
]


simulation_parameters = {
    'T': range(100),
    'N': 1,
    'M': {}
}


config = Configuration(initial_state=initial_conditions,
                       partial_state_update_blocks=partial_state_update_blocks,
                       sim_config=simulation_parameters
                      )


exec_mode = ExecutionMode()
exec_context = ExecutionContext(exec_mode.single_proc)
executor = Executor(exec_context, [config])
raw_result, tensor = executor.execute()
