/*****
 *   Params
 *   This files functionality is to parse all console arguments that are passed to the cli tool
 *   Created by Keleko34
 *****/

module.exports = function params(argv)
{
  return {
    task:argv[0]
  }
}